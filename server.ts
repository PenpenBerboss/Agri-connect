import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Supabase Admin (Lazy)
let supabaseAdminInstance: any = null;

function getSupabaseAdmin() {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing SUPABASE environment variables! URL exists:", !!supabaseUrl, "KEY exists:", !!supabaseKey);
      throw new Error("Missing Supabase configuration");
    }
    
    console.log("Initializing Supabase Admin with URL:", supabaseUrl);
    supabaseAdminInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseAdminInstance;
}

// Helper to access Supabase Admin
const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
  auth: { admin: { deleteUser: (id: string) => getSupabaseAdmin().auth.admin.deleteUser(id) } }
};

const app = express();
const PORT = 3000;

app.use(express.json());

// API Admin routes for User Management
app.get("/api/profiles", async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('profiles').select('*');
  if (error) {                
      console.error("Supabase Error GET /api/profiles:", error);
      return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

app.get("/api/profiles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', id).single();
    if (error) {
        console.error(`Supabase Error GET /api/profiles/${id}:`, error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error(`Unexpected Error GET /api/profiles/${req.params.id}:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put("/api/profiles/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin.from('profiles').update(req.body).eq('id', id).select();
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

  const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ status })
      .eq('id', id);
      
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/api/profiles/:id", async (req, res) => {
  const { id } = req.params;
  
  // Explicitly delete from profiles table first, to ensure it works even if auth user is missing
  const { error: profileError } = await supabaseAdmin.from('profiles').delete().eq('id', id);
  if (profileError) return res.status(500).json({ error: profileError.message });

  // Then try to delete from Auth (this might cascade to profiles if not already deleted, but we handle it just in case)
  await supabaseAdmin.auth.admin.deleteUser(id);
  
  res.json({ success: true });
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

app.post("/api/products/:id/view", async (req, res) => {
  const { id } = req.params;
  const { data: product, error: fetchError } = await supabaseAdmin.from('products').select('views').eq('id', id).single();
  if (fetchError) return res.status(500).json({ error: fetchError.message });

  const { data, error } = await supabaseAdmin
    .from('products')
    .update({ views: (product.views || 0) + 1 })
    .eq('id', id)
    .select();
    
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

// API Review routes
app.get("/api/reviews", async (req, res) => {
  let query = supabaseAdmin.from('reviews').select('*, profiles!buyer_id(name)');
  
  if (req.query.product_id) {
    query = query.eq('product_id', req.query.product_id);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/reviews", async (req, res) => {
  const { data: review, error: reviewError } = await supabaseAdmin.from('reviews').insert(req.body).select().single();
  if (reviewError) return res.status(500).json({ error: reviewError.message });

  // Update product rating and reviews_count
  const productId = req.body.product_id;
  const { data: reviews, error: reviewsError } = await supabaseAdmin.from('reviews').select('rating').eq('product_id', productId);
  
  if (!reviewsError && reviews) {
    const count = reviews.length;
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / count;
    await supabaseAdmin.from('products').update({ 
      rating: avg, 
      reviews_count: count 
    }).eq('id', productId);
  }

  res.json(review);
});

app.delete("/api/reviews/:id", async (req, res) => {
  const { error } = await supabaseAdmin.from('reviews').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Vite middleware for development
async function setupVite() {
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

  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  setupVite();
}

export default app;

