import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Supabase Admin
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Admin routes for User Management
  app.get("/api/profiles", async (_req, res) => {
    const { data, error } = await supabaseAdmin.from('profiles').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.put("/api/profiles/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'active', 'suspended'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ status })
        .eq('id', id);
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // API Product routes
  app.get("/api/products", async (_req, res) => {
    const { data, error } = await supabaseAdmin.from('products').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/products", async (req, res) => {
    const { data, error } = await supabaseAdmin.from('products').insert(req.body).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.put("/api/products/:id", async (req, res) => {
    const { data, error } = await supabaseAdmin.from('products').update(req.body).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.delete("/api/products/:id", async (req, res) => {
    const { error } = await supabaseAdmin.from('products').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // API Order routes
  app.get("/api/orders", async (_req, res) => {
    const { data, error } = await supabaseAdmin.from('orders').select('*, products(name)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/orders", async (req, res) => {
    const { data, error } = await supabaseAdmin.from('orders').insert(req.body).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
