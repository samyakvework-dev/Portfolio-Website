import { sendContactEmail } from './mailer.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateReferenceId(): string {
  // Generate a clean 4-digit human-readable reference code
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function handleContactRequest(req: any, res: any): Promise<boolean> {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/contact') {
    if (req.method === 'POST') {
      try {
        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        let parsed: any = {};
        try {
          parsed = JSON.parse(body || '{}');
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload.' }));
          return true;
        }

        const name = (parsed.name || '').trim();
        const email = (parsed.email || '').trim();
        const message = (parsed.message || '').trim();
        const subject = (parsed.subject || '').trim() || undefined;

        if (!name || name.length < 2) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Please enter your name (at least 2 characters).' }));
          return true;
        }

        if (!email || !EMAIL_REGEX.test(email)) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Please enter a valid email address.' }));
          return true;
        }

        if (!message || message.length < 5) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Please enter a message (at least 5 characters).' }));
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
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: false,
            error: 'Unable to send your enquiry right now. Please try again later.'
          }));
          return true;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: true,
          message: "Thank you — your enquiry has been sent.",
          referenceId
        }));
        return true;
      } catch (err: any) {
        console.error('[Contact API] Unexpected error handling submission:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: 'Unable to send your enquiry right now. Please try again later.'
        }));
        return true;
      }
    }

    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Method not allowed.' }));
    return true;
  }

  return false;
}
