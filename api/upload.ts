import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractToken, verifySessionToken } from './_lib/auth.js';
import { parseRequestBody, sendResponse } from './_lib/apiHandler.js';
import { saveUploadedFile, createSignedUploadUrl } from './_lib/upload.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return sendResponse(res, 204);
  }

  const token = extractToken(req);
  const session = verifySessionToken(token);
  if (!session.valid) {
    return sendResponse(res, 401, { success: false, error: 'Unauthorized. Admin login required to upload.' });
  }

  if (req.method !== 'POST') {
    return sendResponse(res, 405, { success: false, error: 'Method not allowed.' });
  }

  try {
    const body = await parseRequestBody(req);

    // 1. Direct browser-to-Supabase signed upload URL (bypasses Vercel 4.5 MB body limit)
    if (body.action === 'get-signed-url') {
      if (!body.filename) {
        return sendResponse(res, 400, { success: false, error: 'Filename is required for upload authorization.' });
      }

      const result = await createSignedUploadUrl({
        filename: body.filename,
        contentType: body.contentType || 'application/octet-stream'
      });

      if (!result.success) {
        return sendResponse(res, 500, { success: false, error: result.error });
      }

      return sendResponse(res, 200, result);
    }

    // 2. Server-side upload for small files (or local dev)
    const { filename, dataUrl, contentType } = body;
    if (!dataUrl && !body.buffer) {
      return sendResponse(res, 400, { success: false, error: 'No media data provided for upload.' });
    }

    const result = await saveUploadedFile({
      filename,
      dataUrl,
      contentType
    });

    if (!result.success) {
      return sendResponse(res, 500, { success: false, error: result.error });
    }

    return sendResponse(res, 200, {
      success: true,
      url: result.url,
      message: 'File uploaded successfully.'
    });
  } catch (err: any) {
    console.error('[Upload API Error]', err);
    return sendResponse(res, 500, { success: false, error: err.message || 'File upload failed.' });
  }
}
