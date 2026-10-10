import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractToken, verifySessionToken } from './_lib/auth.js';
import { parseRequestBody, sendResponse } from './_lib/apiHandler.js';
import { saveUploadedFile } from './_lib/upload.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb'
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
