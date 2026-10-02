import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleContactRequest } from '../server/apiHandler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await handleContactRequest(req, res);
  } catch (err: any) {
    console.error('[Vercel Serverless Function Error]', err);
    if (!res.headersSent && !res.writableEnded) {
      res.status(500).json({
        success: false,
        error: 'Unable to send your enquiry right now. Please try again later.'
      });
    }
  }
}
