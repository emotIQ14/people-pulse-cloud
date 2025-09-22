import express from "express";
import serverless from "serverless-http";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Serve static files from the built frontend (dist)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback (non-API routes)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) next();
  });
});

export const config = { runtime: 'nodejs18.x' };
export default serverless(app);