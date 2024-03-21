import { createServer } from 'vite';
import express from 'express';
const PORT = process.env.PORT || 80
async function startServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { middlewareMode: true },
  });

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve index.html for all non-file requests
  app.use('*', async (req, res) => {
    const url = req.originalUrl;
    try {
      let template = '';
      if (url.startsWith('/')) {
        template = await vite.transformIndexHtml(url, '');
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  // Start express server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
