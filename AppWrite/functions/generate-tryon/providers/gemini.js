/**
 * Gemini (Nano Banana) provider for virtual try-on.
 *
 * Uses Google's Gemini 2.5 Flash image generation REST API to perform
 * virtual try-on by sending the user photo and garment image together
 * with a descriptive prompt. The response contains inline base64 image
 * data — no polling is required.
 *
 * Env:
 *   GEMINI_API_KEY  (required)
 */

const GEMINI_MODEL = 'gemini-2.5-flash-image';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Download an image URL and return { base64, mimeType }.
 */
async function fetchImageAsBase64(url, label, log) {
  log(`[gemini] Downloading ${label}: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${label} (HTTP ${res.status})`);
  }

  const contentType = res.headers.get('content-type') || 'image/png';
  // Normalise MIME — keep only the base type (e.g. "image/jpeg; charset=..." → "image/jpeg")
  const mimeType = contentType.split(';')[0].trim();

  const buffer = Buffer.from(await res.arrayBuffer());
  const base64 = buffer.toString('base64');
  log(`[gemini] ${label}: ${buffer.length} bytes, mime=${mimeType}`);
  return { base64, mimeType };
}

/**
 * @param {object}   opts
 * @param {string}   opts.userImageUrl    – URL of the person's photo
 * @param {string}   opts.garmentImageUrl – URL of the garment image
 * @param {Function} opts.log             – Appwrite log helper
 * @param {Function} opts.error           – Appwrite error helper
 * @returns {Promise<{ images: Buffer[] }>}
 */
module.exports = async function generateTryOn({ userImageUrl, garmentImageUrl, log, error }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  /* ── 1. Download both images as base64 ────────────────────────────── */
  const [userImg, garmentImg] = await Promise.all([
    fetchImageAsBase64(userImageUrl, 'user image', log),
    fetchImageAsBase64(garmentImageUrl, 'garment image', log),
  ]);

  /* ── 2. Build the Gemini request ──────────────────────────────────── */
  const prompt =
    'You are a virtual try-on assistant. ' +
    'The first image is a photo of a person. The second image is a garment. ' +
    'Generate a realistic photo of the same person wearing the garment from the second image. ' +
    'Keep the person\'s face, body shape, pose, and background unchanged. ' +
    'The garment should fit naturally with correct lighting, wrinkles, and shadows.';

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: userImg.mimeType,
              data: userImg.base64,
            },
          },
          {
            inline_data: {
              mime_type: garmentImg.mimeType,
              data: garmentImg.base64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  };

  const url = `${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  log(`[gemini] Sending request to ${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent`);

  /* ── 3. Call Gemini API ───────────────────────────────────────────── */
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  log(`[gemini] Response status: ${res.status}`);

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API failed (${res.status}): ${errBody}`);
  }

  const json = await res.json();

  /* ── 4. Extract image parts from response ─────────────────────────── */
  const candidates = json.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error('Gemini returned no candidates');
  }

  const parts = candidates[0].content?.parts || [];
  const images = [];

  for (const part of parts) {
    if (part.text) {
      log(`[gemini] Text response: ${part.text}`);
    }
    if (part.inlineData || part.inline_data) {
      const inlineData = part.inlineData || part.inline_data;
      const imgBuffer = Buffer.from(inlineData.data, 'base64');
      log(`[gemini] Received image: ${imgBuffer.length} bytes, mime=${inlineData.mimeType || inlineData.mime_type}`);
      images.push(imgBuffer);
    }
  }

  if (images.length === 0) {
    // Log the full response structure for debugging
    error(`[gemini] No images in response. Parts: ${JSON.stringify(parts.map(p => Object.keys(p)))}`);
    throw new Error('Gemini completed but returned no images');
  }

  log(`[gemini] Successfully generated ${images.length} image(s)`);
  return { images };
};
