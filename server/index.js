import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleContactRequest } from './apiHandler.js';

const PORT = process.env.PORT || 3001;
const distDir = path.resolve(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const handled = await handleContactRequest(req, res);
  if (handled) return;

  // Serve static dist in production if built
  if (fs.existsSync(distDir)) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let filePath = path.join(distDir, url.pathname === '/' ? 'index.html' : url.pathname);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Fallback to index.html for SPA routes
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }
  }

  res.statusCode = 404;
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
