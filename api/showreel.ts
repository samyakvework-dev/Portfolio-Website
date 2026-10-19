import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getShowreel, saveShowreel } from './_lib/store.js';
import { extractToken, verifySessionToken } from './_lib/auth.js';
import { parseRequestBody, sendResponse } from './_lib/apiHandler.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return sendResponse(res, 204);
  }

  try {
    // GET: Publicly accessible so visitors and ReelSection can fetch showreel dynamically
    if (req.method === 'GET') {
      const showreel = await getShowreel();
      return sendResponse(res, 200, { success: true, showreel });
    }

    // Mutating methods require admin authorization
    const token = extractToken(req);
    const session = verifySessionToken(token);
    if (!session.valid) {
      return sendResponse(res, 401, { success: false, error: 'Unauthorized. Admin login required to edit Showreel.' });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = await parseRequestBody(req);
      const updated = await saveShowreel(body);
      return sendResponse(res, 200, { success: true, showreel: updated, message: 'Showreel configuration saved successfully.' });
    }

    return sendResponse(res, 405, { success: false, error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('[Showreel API Error]', err);
    return sendResponse(res, 500, { success: false, error: err.message || 'Internal server error.' });
  }
}
