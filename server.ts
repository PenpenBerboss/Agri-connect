import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Initialize Supabase Admin lazily to prevent startup crashes
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
    }
    supabaseAdmin = createClient(url, key);
  }
  return supabaseAdmin;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Admin routes for User Management
  app.get("/api/profiles", async (_req, res) => {
    const { data, error } = await getSupabaseAdmin().from('profiles').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get("/api/profiles/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await getSupabaseAdmin().from('profiles').select('*').eq('id', id).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });
  
  app.put("/api/profiles/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await getSupabaseAdmin().from('profiles').update(req.body).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.put("/api/profiles/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'active', 'suspended'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await getSupabaseAdmin()
        .from('profiles')
        .update({ status })
        .eq('id', id);
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.delete("/api/profiles/:id", async (req, res) => {
    const { id } = req.params;
    
    // Explicitly delete from profiles table first, to ensure it works even if auth user is missing
    const { error: profileError } = await getSupabaseAdmin().from('profiles').delete().eq('id', id);
    if (profileError) return res.status(500).json({ error: profileError.message });

    // Then try to delete from Auth (this might cascade to profiles if not already deleted, but we handle it just in case)
    await getSupabaseAdmin().auth.admin.deleteUser(id);
    
    res.json({ success: true });
  });

  // API Product routes
  app.get("/api/products", async (_req, res) => {
    const { data, error } = await getSupabaseAdmin().from('products').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/products", async (req, res) => {
    const { data, error } = await getSupabaseAdmin().from('products').insert(req.body).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.put("/api/products/:id", async (req, res) => {
    const { data, error } = await getSupabaseAdmin().from('products').update(req.body).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.post("/api/products/:id/view", async (req, res) => {
    const { id } = req.params;
    const { data: product, error: fetchError } = await getSupabaseAdmin().from('products').select('views').eq('id', id).single();
    if (fetchError) return res.status(500).json({ error: fetchError.message });

    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .update({ views: (product.views || 0) + 1 })
      .eq('id', id)
      .select();
      
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.delete("/api/products/:id", async (req, res) => {
    const { error } = await getSupabaseAdmin().from('products').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // API Order routes
  app.get("/api/orders", async (_req, res) => {
    const { data, error } = await getSupabaseAdmin().from('orders').select('*, products(name)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/orders", async (req, res) => {
    const { data, error } = await getSupabaseAdmin().from('orders').insert(req.body).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  // API Review routes
  app.get("/api/reviews", async (req, res) => {
    let query = getSupabaseAdmin().from('reviews').select('*, profiles!buyer_id(name)');
    
    if (req.query.product_id) {
      query = query.eq('product_id', req.query.product_id);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/reviews", async (req, res) => {
    const { data: review, error: reviewError } = await getSupabaseAdmin().from('reviews').insert(req.body).select().single();
    if (reviewError) return res.status(500).json({ error: reviewError.message });

    // Update product rating and reviews_count
    const productId = req.body.product_id;
    const { data: reviews, error: reviewsError } = await getSupabaseAdmin().from('reviews').select('rating').eq('product_id', productId);
    
    if (!reviewsError && reviews) {
      const count = reviews.length;
      const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / count;
      await getSupabaseAdmin().from('products').update({ 
        rating: avg, 
        reviews_count: count 
      }).eq('id', productId);
    }

    res.json(review);
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    const { error } = await getSupabaseAdmin().from('reviews').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
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
