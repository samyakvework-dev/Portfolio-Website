import { sendContactEmail } from './mailer.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateReferenceId(): string {
  // Generate a clean 4-digit human-readable reference code
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function sendResponse(res: any, status: number, data: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Universal body parser supporting:
 * 1. Vercel pre-parsed object or JSON string
 * 2. Raw streaming Node.js / Vite middleware
 */
export async function parseRequestBody(req: any): Promise<any> {
  // 1. If body is already parsed by Vercel serverless runtime
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') {
      return req.body;
    }
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
  }

  // 2. Otherwise read from stream (Vite local dev server / raw Node HTTP)
  try {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
    }
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    return {};
  }

  return {};
}

export async function handleContactRequest(req: any, res: any): Promise<boolean> {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      res.status(204).end();
    } else {
      res.statusCode = 204;
      res.end();
    }
    return true;
  }

  if (req.method !== 'POST') {
    sendResponse(res, 405, { success: false, error: 'Method not allowed.' });
    return true;
  }

  try {
    const parsed = await parseRequestBody(req);

    const name = (parsed.name || '').trim();
    const email = (parsed.email || '').trim();
    const message = (parsed.message || '').trim();
    const subject = (parsed.subject || '').trim() || undefined;

    if (!name || name.length < 2) {
      sendResponse(res, 400, {
        success: false,
        error: 'Please enter your name (at least 2 characters).'
      });
      return true;
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      sendResponse(res, 400, {
        success: false,
        error: 'Please enter a valid email address.'
      });
      return true;
    }

    if (!message || message.length < 5) {
      sendResponse(res, 400, {
        success: false,
        error: 'Please enter a message (at least 5 characters).'
      });
      return true;
    }

    const referenceId = generateReferenceId();
    const createdAt = new Date().toISOString();

    // Dispatch email directly via Gmail SMTP
    const emailResult = await sendContactEmail({
      name,
      email,
      message,
      subject,
      referenceId,
      createdAt
    });

    if (!emailResult.success) {
      console.error('[Contact API] Failed to send enquiry email:', emailResult.error);
      sendResponse(res, 500, {
        success: false,
        error: 'Unable to send your enquiry right now. Please try again later.'
      });
      return true;
    }

    sendResponse(res, 200, {
      success: true,
      message: 'Thank you — your enquiry has been sent.',
      referenceId
    });
    return true;
  } catch (err: any) {
    console.error('[Contact API] Unexpected error handling submission:', err);
    sendResponse(res, 500, {
      success: false,
      error: 'Unable to send your enquiry right now. Please try again later.'
    });
    return true;
  }
}
