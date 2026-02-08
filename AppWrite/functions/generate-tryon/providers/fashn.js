/**
 * FASHN API provider for virtual try-on.
 *
 * Submits a try-on job to FASHN's REST API, polls for completion,
 * then downloads the result images and returns them as Buffers.
 *
 * Env:
 *   FASHN_API_KEY  (required)
 */

const FASHN_BASE = 'https://api.fashn.ai/v1';
const POLL_INTERVAL_MS = 2000; // 2 seconds between polls
const MAX_POLLS = 90;          // 3 minutes max (90 x 2 s)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {object}   opts
 * @param {string}   opts.userImageUrl    – URL of the person's photo
 * @param {string}   opts.garmentImageUrl – URL of the garment image
 * @param {Function} opts.log             – Appwrite log helper
 * @param {Function} opts.error           – Appwrite error helper
 * @returns {Promise<{ images: Buffer[] }>}
 */
module.exports = async function generateTryOn({ userImageUrl, garmentImageUrl, log, error }) {
  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) {
    throw new Error('FASHN_API_KEY is not set');
  }

  /* ── 1. Submit to FASHN /run ──────────────────────────────────────── */
  const payload = {
    model_name: 'tryon-v1.6',
    inputs: {
      model_image: userImageUrl,
      garment_image: garmentImageUrl,
      category: 'auto',
    },
  };
  log(`[fashn] Submitting to FASHN /run: ${JSON.stringify(payload)}`);

  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  log(`[fashn] /run response status: ${runRes.status}`);

  if (!runRes.ok) {
    const errBody = await runRes.text();
    throw new Error(`FASHN /run failed (${runRes.status}): ${errBody}`);
  }

  const runJson = await runRes.json();
  log(`[fashn] /run response body: ${JSON.stringify(runJson)}`);

  const { id: predictionId, error: runError } = runJson;
  if (runError || !predictionId) {
    throw new Error(runError || 'FASHN returned no prediction ID');
  }

  log(`[fashn] Prediction submitted: ${predictionId}`);

  /* ── 2. Poll for status ───────────────────────────────────────────── */
  log(`[fashn] Starting polling (max ${MAX_POLLS} polls, ${POLL_INTERVAL_MS}ms interval)`);
  let prediction = null;

  for (let i = 0; i < MAX_POLLS; i++) {
    await sleep(POLL_INTERVAL_MS);

    const statusRes = await fetch(`${FASHN_BASE}/status/${predictionId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!statusRes.ok) {
      log(`[fashn] Poll ${i + 1}/${MAX_POLLS}: HTTP ${statusRes.status}, retrying...`);
      continue;
    }

    prediction = await statusRes.json();
    log(`[fashn] Poll ${i + 1}/${MAX_POLLS}: status="${prediction.status}"`);

    if (prediction.status === 'completed') {
      log(`[fashn] Completed after ${i + 1} poll(s)`);
      break;
    }

    if (prediction.status === 'failed') {
      const errMsg = prediction.error?.message || prediction.error || 'FASHN generation failed';
      throw new Error(errMsg);
    }

    // 'starting', 'in_queue', 'processing' → keep polling
  }

  if (!prediction || prediction.status !== 'completed') {
    throw new Error('FASHN processing timed out');
  }

  /* ── 3. Extract result URLs and download into Buffers ──────────── */
  log(`[fashn] Extracting result URLs from output: ${JSON.stringify(prediction.output)}`);
  const resultUrls = Array.isArray(prediction.output)
    ? prediction.output
        .filter(Boolean)
        .map((u) => (typeof u === 'string' ? u : u?.url || '').trim())
        .filter(Boolean)
    : [];

  log(`[fashn] Extracted ${resultUrls.length} URL(s): ${resultUrls.join(', ')}`);

  if (resultUrls.length === 0) {
    throw new Error('FASHN completed but returned no image URLs');
  }

  const images = [];
  for (let idx = 0; idx < resultUrls.length; idx++) {
    const url = resultUrls[idx];
    log(`[fashn] Downloading image ${idx + 1}/${resultUrls.length}: ${url}`);

    const imgRes = await fetch(url);
    if (!imgRes.ok) {
      error(`[fashn] Image ${idx + 1}: download failed (HTTP ${imgRes.status})`);
      continue;
    }

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    log(`[fashn] Image ${idx + 1}: downloaded ${buffer.length} bytes`);
    images.push(buffer);
  }

  if (images.length === 0) {
    throw new Error('All FASHN image downloads failed');
  }

  return { images };
};
