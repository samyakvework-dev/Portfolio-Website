import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyCredentials, createSessionToken, verifySessionToken, updateAdminPassword, extractToken } from './_lib/auth.js';
import { parseRequestBody, sendResponse } from './_lib/apiHandler.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return sendResponse(res, 204);
  }

  try {
    const urlObj = new URL(req.url || '/', 'http://localhost');
    const query = Object.fromEntries(urlObj.searchParams.entries());

    // ------------------------------------------------------------------------
    // GET: Check current session status
    // ------------------------------------------------------------------------
    if (req.method === 'GET') {
      const token = extractToken(req);
      const session = verifySessionToken(token);
      if (session.valid) {
        return sendResponse(res, 200, { authenticated: true, email: session.email });
      }
      return sendResponse(res, 200, { authenticated: false });
    }

    // ------------------------------------------------------------------------
    // POST: Actions (login, logout, change-password)
    // ------------------------------------------------------------------------
    if (req.method === 'POST') {
      const body = await parseRequestBody(req);
      const action = body.action || query.action;

      // LOGIN
      if (action === 'login' || (!action && body.email && body.password)) {
        const email = (body.email || '').trim();
        const password = body.password || '';

        const isValid = verifyCredentials(email, password);
        if (!isValid) {
          return sendResponse(res, 401, {
            success: false,
            error: 'Invalid administrator email or password.'
          });
        }

        const token = createSessionToken(email);
        return sendResponse(res, 200, {
          success: true,
          message: 'Welcome back, Samyak.',
          token,
          email
        });
      }

      // LOGOUT
      if (action === 'logout') {
        return sendResponse(res, 200, { success: true, message: 'Logged out successfully.' });
      }

      // CHANGE PASSWORD
      if (action === 'change-password') {
        const token = extractToken(req);
        const session = verifySessionToken(token);
        if (!session.valid) {
          return sendResponse(res, 401, { success: false, error: 'Unauthorized.' });
        }

        const { currentPassword, newPassword } = body;
        if (!verifyCredentials(session.email || '', currentPassword)) {
          return sendResponse(res, 400, { success: false, error: 'Current password is incorrect.' });
        }

        if (!newPassword || newPassword.length < 8) {
          return sendResponse(res, 400, { success: false, error: 'New password must be at least 8 characters.' });
        }

        const updated = updateAdminPassword(newPassword);
        if (updated) {
          return sendResponse(res, 200, { success: true, message: 'Password updated successfully.' });
        }
        return sendResponse(res, 500, { success: false, error: 'Failed to update password.' });
      }

      return sendResponse(res, 400, { success: false, error: 'Unknown action.' });
    }

    return sendResponse(res, 405, { success: false, error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('[Admin API Error]', err);
    return sendResponse(res, 500, { success: false, error: err.message || 'Internal server error.' });
  }
}
