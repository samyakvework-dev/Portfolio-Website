import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { handleContactRequest } from './server/apiHandler';

function contactDbPlugin() {
  return {
    name: 'contact-db-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/contact')) {
          const handled = await handleContactRequest(req, res);
          if (handled) return;
        }
        next();
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/contact')) {
          const handled = await handleContactRequest(req, res);
          if (handled) return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    contactDbPlugin()
  ],
  server: {
    port: 5173,
    host: true
  }
});
