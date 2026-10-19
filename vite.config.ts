import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function apiDevPlugin(): Plugin {
  return {
    name: 'portfolio-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Route: /api/contact
        if (url.startsWith('/api/contact')) {
          try {
            const { handleContactRequest } = await server.ssrLoadModule('/api/_lib/apiHandler.ts');
            const handled = await handleContactRequest(req, res);
            if (handled) return;
          } catch (err) {
            console.error('[Vite dev middleware error - contact]', err);
          }
        }

        // Route: /api/projects
        if (url.startsWith('/api/projects')) {
          try {
            const mod = await server.ssrLoadModule('/api/projects.ts');
            const handler = mod.default;
            await handler(req, res);
            return;
          } catch (err) {
            console.error('[Vite dev middleware error - projects]', err);
          }
        }

        // Route: /api/showreel
        if (url.startsWith('/api/showreel')) {
          try {
            const mod = await server.ssrLoadModule('/api/showreel.ts');
            const handler = mod.default;
            await handler(req, res);
            return;
          } catch (err) {
            console.error('[Vite dev middleware error - showreel]', err);
          }
        }

        // Route: /api/admin
        if (url.startsWith('/api/admin')) {
          try {
            const mod = await server.ssrLoadModule('/api/admin.ts');
            const handler = mod.default;
            await handler(req, res);
            return;
          } catch (err) {
            console.error('[Vite dev middleware error - admin]', err);
          }
        }

        // Route: /api/upload
        if (url.startsWith('/api/upload')) {
          try {
            const mod = await server.ssrLoadModule('/api/upload.ts');
            const handler = mod.default;
            await handler(req, res);
            return;
          } catch (err) {
            console.error('[Vite dev middleware error - upload]', err);
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
    apiDevPlugin()
  ],
  server: {
    port: 5173,
    host: true
  }
});
