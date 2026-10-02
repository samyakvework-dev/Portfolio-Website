import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function contactDevPlugin(): Plugin {
  return {
    name: 'contact-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/contact')) {
          try {
            const { handleContactRequest } = await server.ssrLoadModule('/api/_lib/apiHandler.ts');
            const handled = await handleContactRequest(req, res);
            if (handled) return;
          } catch (err) {
            console.error('[Vite dev middleware error]', err);
          }
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
    contactDevPlugin()
  ],
  server: {
    port: 5173,
    host: true
  }
});
