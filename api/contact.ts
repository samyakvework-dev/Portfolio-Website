import { handleContactRequest } from '../server/apiHandler.ts';

export default async function handler(req: any, res: any) {
  try {
    await handleContactRequest(req, res);
  } catch (err: any) {
    console.error('[Vercel Serverless Function Error]', err);
    if (!res.headersSent && !res.writableEnded) {
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        res.status(500).json({
          success: false,
          error: 'Unable to send your enquiry right now. Please try again later.'
        });
      } else {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: 'Unable to send your enquiry right now. Please try again later.'
        }));
      }
    }
  }
}
