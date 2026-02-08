# Appwrite Functions for Tryshop

This folder holds Appwrite Cloud Functions. You will connect it to your Appwrite project manually.

## Setup

1. Install the [Appwrite CLI](https://appwrite.io/docs/installation) and log in:
   ```bash
   appwrite login
   ```
2. From the **project root** (or from this folder, depending on your CLI setup), run:
   ```bash
   appwrite init
   ```
   and link this directory to your existing Appwrite project when prompted.

3. Create a Storage bucket in the Appwrite Console for try-on uploads (e.g. `tryOnUploads`). Set create/read permissions as needed. Note the bucket ID and add it to your main app `.env` as `VITE_APPWRITE_TRY_ON_BUCKET_ID`.

4. Create the **generate-tryon** function in the Appwrite Console (or via CLI), set the runtime to Node.js (e.g. 18 or 20), and configure the following environment variables for the function:
   - `FASHN_API_KEY` – your FASHN API key from [app.fashn.ai](https://app.fashn.ai)
   - `APPWRITE_API_KEY` – an Appwrite API key with read/write access to your database (and storage if you persist result images)
   - `APPWRITE_DATABASE_ID` – your database ID (same as `VITE_APPWRITE_DATABASE_ID` in the main app)
   - `APPWRITE_ENDPOINT` – (optional) e.g. `https://cloud.appwrite.io/v1`
   - `APPWRITE_PROJECT_ID` – (optional) usually injected by Appwrite as `APPWRITE_FUNCTION_PROJECT_ID`

5. Deploy the function code from this folder. The function entry point should be `index.js` in `functions/generate-tryon/`. Add the function ID to your main app `.env` as `VITE_APPWRITE_FUNCTION_TRYON_ID`.

## Function: generate-tryon

- **Input:** Request body `{ "tryOnId": "<tryOn document ID>" }`.
- **Behavior:** Loads the TryOn and linked Product, calls FASHN API (model_image = user upload URL, garment_image = product image), then updates the TryOn document’s `resultImageUrls` with the result image URL(s).
- **Dependencies:** `fashn`, `node-appwrite` (see `functions/generate-tryon/package.json`).

Install dependencies before deploying:

```bash
cd functions/generate-tryon && npm install
```
