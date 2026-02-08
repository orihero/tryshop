/**
 * Appwrite Function: Generate try-on image via pluggable AI provider.
 *
 * The active provider is selected by the TRYON_PROVIDER env var:
 *   "gemini"  → Google Gemini (Nano Banana) image generation
 *   "fashn"   → FASHN virtual try-on API
 *
 * Each provider returns raw image Buffers. This handler takes care of
 * uploading them to Appwrite Storage and updating the tryOn document.
 *
 * Expects request body: { "tryOnId": "<tryOn document ID>" }
 *
 * Env (set in Appwrite Console):
 * - TRYON_PROVIDER             ("gemini" | "fashn", default "gemini")
 * - GEMINI_API_KEY             (required when provider = gemini)
 * - FASHN_API_KEY              (required when provider = fashn)
 * - APPWRITE_API_KEY           (required, needs db + storage write access)
 * - APPWRITE_ENDPOINT          (optional, default https://cloud.appwrite.io/v1)
 * - APPWRITE_PROJECT_ID        (optional, injected as APPWRITE_FUNCTION_PROJECT_ID)
 * - APPWRITE_DATABASE_ID       (required)
 * - APPWRITE_TRY_ON_BUCKET_ID  (required, storage bucket for result images)
 */

const { Client, Databases, ID } = require('node-appwrite');

/* ── Provider registry ────────────────────────────────────────────────── */
const PROVIDERS = {
  gemini: require('./providers/gemini'),
  fashn:  require('./providers/fashn'),
};

/* ── Helpers ───────────────────────────────────────────────────────────── */

/** Mask a secret for safe logging: show first 4 chars + asterisks */
function mask(value) {
  if (!value) return '(not set)';
  if (value.length <= 6) return '***';
  return value.slice(0, 4) + '****' + value.slice(-2);
}

/**
 * Best-effort status update — never throws so it can't mask a real error.
 */
async function safeSetStatus(log, error, databases, databaseId, tryOnId, status, extra = {}) {
  try {
    log(`[safeSetStatus] Setting tryOn ${tryOnId} status -> "${status}" ${JSON.stringify(extra)}`);
    await databases.updateDocument(databaseId, 'tryOn', tryOnId, { status, ...extra });
    log(`[safeSetStatus] Status updated successfully`);
  } catch (err) {
    error(`[safeSetStatus] Failed to update status to "${status}": ${err.message || err}`);
  }
}

/**
 * Upload a buffer to Appwrite Storage using the REST API directly.
 * Avoids SDK compatibility issues with File/InputFile on Node 18.
 */
async function uploadToStorage(endpoint, projectId, apiKey, bucketId, fileId, buffer, filename) {
  const formData = new FormData();
  formData.append('fileId', fileId);
  formData.append('file', new Blob([buffer]), filename);

  const response = await fetch(`${endpoint}/storage/buckets/${bucketId}/files`, {
    method: 'POST',
    headers: {
      'X-Appwrite-Project': projectId,
      'X-Appwrite-Key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Storage upload failed (${response.status}): ${errText}`);
  }
  return response.json();
}

/**
 * Build a public view URL for a file in Appwrite Storage.
 */
function buildFileViewUrl(endpoint, projectId, bucketId, fileId) {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}

/* ── Main handler ──────────────────────────────────────────────────────── */
module.exports = async ({ req, res, log, error }) => {
  log('=== generate-tryon function invoked ===');
  log(`Request method: ${req.method}`);

  /* ---------- 1. Parse request body ---------- */
  let body = {};
  try {
    body = req.bodyJson || (req.bodyText ? JSON.parse(req.bodyText) : {});
    log(`[1/8] Parsed request body: ${JSON.stringify(body)}`);
  } catch (parseErr) {
    error(`[1/8] Failed to parse request body: ${parseErr.message}`);
    body = {};
  }
  const tryOnId = body.tryOnId;

  if (!tryOnId) {
    error('[1/8] Missing tryOnId in request body');
    return res.json({ ok: false, message: 'Missing tryOnId' }, 400);
  }
  log(`[1/8] tryOnId = ${tryOnId}`);

  /* ---------- 2. Read & validate env ---------- */
  const providerName = (process.env.TRYON_PROVIDER || 'gemini').toLowerCase();
  const provider = PROVIDERS[providerName];

  if (!provider) {
    error(`[2/8] Unknown TRYON_PROVIDER: "${providerName}". Must be one of: ${Object.keys(PROVIDERS).join(', ')}`);
    return res.json({ ok: false, message: `Unknown provider: ${providerName}` }, 500);
  }

  // Prefer dynamic API key from Appwrite runtime header, then env var
  const dynamicKey = (req.headers && req.headers['x-appwrite-key']) || process.env.APPWRITE_FUNCTION_API_KEY;
  const awKey     = dynamicKey || process.env.APPWRITE_API_KEY;
  const dbId      = process.env.APPWRITE_DATABASE_ID;
  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
  const endpoint  = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const bucketId  = process.env.APPWRITE_TRY_ON_BUCKET_ID;

  log(`[2/8] Environment variables:`);
  log(`  TRYON_PROVIDER         = ${providerName}`);
  log(`  APPWRITE_API_KEY       = ${mask(awKey)}`);
  log(`  APPWRITE_DATABASE_ID   = ${dbId || '(not set)'}`);
  log(`  PROJECT_ID             = ${projectId || '(not set)'}`);
  log(`  APPWRITE_ENDPOINT      = ${endpoint}`);
  log(`  TRY_ON_BUCKET_ID       = ${bucketId || '(not set)'}`);

  if (!awKey || !dbId || !projectId || !bucketId) {
    error('[2/8] Missing one or more required env vars: APPWRITE_API_KEY, APPWRITE_DATABASE_ID, project ID, or APPWRITE_TRY_ON_BUCKET_ID');
    return res.json({ ok: false, message: 'Server configuration error' }, 500);
  }
  log('[2/8] All required env vars present');

  /* ---------- 3. Appwrite SDK setup ---------- */
  log(`[3/8] Initializing Appwrite client -> endpoint=${endpoint}, project=${projectId}`);
  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(awKey);
  const databases = new Databases(client);
  log('[3/8] Appwrite client initialized');

  try {
    /* ---------- 4. Fetch tryOn + product docs ---------- */
    log(`[4/8] Fetching tryOn document: db=${dbId}, collection=tryOn, id=${tryOnId}`);
    const tryOn = await databases.getDocument(dbId, 'tryOn', tryOnId);
    log(`[4/8] TryOn document fetched. Keys: ${Object.keys(tryOn).join(', ')}`);

    const userImageUrl =
      Array.isArray(tryOn.imageUrls) && tryOn.imageUrls[0] ? tryOn.imageUrls[0] : null;
    log(`[4/8] User image URL: ${userImageUrl || '(none)'}`);

    if (!userImageUrl) {
      error('[4/8] TryOn has no image URL in imageUrls array');
      await safeSetStatus(log, error, databases, dbId, tryOnId, 'error');
      return res.json({ ok: false, message: 'TryOn has no image URL' }, 400);
    }

    const productId = typeof tryOn.product === 'string' ? tryOn.product : tryOn.product?.$id;
    log(`[4/8] Product ID resolved: ${productId || '(none)'}`);

    if (!productId) {
      error('[4/8] TryOn has no product reference');
      await safeSetStatus(log, error, databases, dbId, tryOnId, 'error');
      return res.json({ ok: false, message: 'TryOn has no product' }, 400);
    }

    log(`[4/8] Fetching product document: db=${dbId}, collection=product, id=${productId}`);
    const product = await databases.getDocument(dbId, 'product', productId);
    log(`[4/8] Product document fetched: title="${product.title}"`);

    const garmentImageUrl =
      product.image || (Array.isArray(product.gallery) && product.gallery[0]) || null;
    log(`[4/8] Garment image URL: ${garmentImageUrl || '(none)'}`);

    if (!garmentImageUrl) {
      error('[4/8] Product has no image or gallery');
      await safeSetStatus(log, error, databases, dbId, tryOnId, 'error');
      return res.json({ ok: false, message: 'Product has no image' }, 400);
    }

    /* ---------- 5. Set status → processing ---------- */
    log(`[5/8] Setting tryOn status -> "processing"`);
    await databases.updateDocument(dbId, 'tryOn', tryOnId, { status: 'processing' });
    log('[5/8] Status set to "processing"');

    /* ---------- 6. Call the active provider ---------- */
    log(`[6/8] Calling provider "${providerName}"...`);
    const { images } = await provider({ userImageUrl, garmentImageUrl, log, error });
    log(`[6/8] Provider returned ${images.length} image buffer(s)`);

    /* ---------- 7. Upload image buffers to Appwrite Storage ---------- */
    log(`[7/8] Uploading ${images.length} image(s) to Appwrite Storage`);
    const permanentUrls = [];

    for (let idx = 0; idx < images.length; idx++) {
      const buffer = images[idx];
      const fileId = `${ID.unique()}.png`;

      log(`[7/8] Image ${idx + 1}/${images.length}: uploading to bucket=${bucketId}, fileId=${fileId} (${buffer.length} bytes)`);
      await uploadToStorage(endpoint, projectId, awKey, bucketId, fileId, buffer, fileId);

      const viewUrl = buildFileViewUrl(endpoint, projectId, bucketId, fileId);
      permanentUrls.push(viewUrl);
      log(`[7/8] Image ${idx + 1}: uploaded successfully -> ${viewUrl}`);
    }

    if (permanentUrls.length === 0) {
      error('[7/8] All image uploads failed');
      await safeSetStatus(log, error, databases, dbId, tryOnId, 'error');
      return res.json({ ok: false, message: 'Failed to upload result images' }, 502);
    }

    /* ---------- 8. Update tryOn → completed ---------- */
    const updatePayload = {
      status: 'completed',
      resultImageUrls: permanentUrls,
    };
    log(`[8/8] Updating tryOn document with: ${JSON.stringify(updatePayload)}`);
    await databases.updateDocument(dbId, 'tryOn', tryOnId, updatePayload);

    log(`[8/8] TryOn ${tryOnId} completed with ${permanentUrls.length} image(s)`);
    log('=== generate-tryon function finished successfully ===');
    return res.json({ ok: true, resultImageUrls: permanentUrls });
  } catch (err) {
    error(`[UNCAUGHT] ${err.message || String(err)}`);
    error(`[UNCAUGHT] Stack: ${err.stack || '(no stack)'}`);
    await safeSetStatus(log, error, databases, dbId, tryOnId, 'error');
    return res.json({ ok: false, message: err.message || 'Function error' }, 500);
  }
};
