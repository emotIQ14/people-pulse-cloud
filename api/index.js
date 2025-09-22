const express = require('express');
const serverless = require('serverless-http');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }));

const OUT_DIR = process.env.OUT_DIR || 'dist';
const distPath = path.join(__dirname, '..', OUT_DIR);
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) next(err);
  });
});

module.exports = serverless(app);
