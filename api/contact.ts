import { handleContactRequest } from '../server/apiHandler.ts';

export default async function handler(req: any, res: any) {
  // Normalize req.url for Vercel serverless environment
  if (!req.url || !req.url.startsWith('/api/contact')) {
    req.url = '/api/contact';
  }

  const handled = await handleContactRequest(req, res);
  if (!handled && !res.writableEnded) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
}
