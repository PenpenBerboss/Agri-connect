import express from "express";
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Validation des variables d'environnement critiques
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("CRITICAL: Missing Supabase environment variables");
}

const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || ''
);

// Helper pour gérer les erreurs
const handleError = (res: any, error: any) => {
  console.error("Database Error:", error);
  return res.status(500).json({ error: error.message, details: error });
};

// Profiles
app.get("/api/profiles", async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('profiles').select('*');
  if (error) return handleError(res, error);
  res.json(data || []);
});

app.get("/api/profiles/:id", async (req, res) => {
  const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', req.params.id).single();
  if (error) return handleError(res, error);
  res.json(data);
});

app.put("/api/profiles/:id", async (req, res) => {
  const { data, error } = await supabaseAdmin.from('profiles').update(req.body).eq('id', req.params.id).select();
  if (error) return handleError(res, error);
  res.json(data ? data[0] : null);
});

// Products
app.get("/api/products", async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('products').select('*');
    if (error) return handleError(res, error);
    res.json(Array.isArray(data) ? data : []);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/products", async (req, res) => {
  const { data, error } = await supabaseAdmin.from('products').insert(req.body).select();
  if (error) return handleError(res, error);
  res.json(data ? data[0] : null);
});

app.post("/api/products/:id/view", async (req, res) => {
  const { data: product } = await supabaseAdmin.from('products').select('views').eq('id', req.params.id).single();
  const { data, error } = await supabaseAdmin.from('products').update({ views: (product?.views || 0) + 1 }).eq('id', req.params.id).select();
  if (error) return handleError(res, error);
  res.json(data ? data[0] : null);
});

// Orders
app.get("/api/orders", async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('orders').select('*, products(name)');
  if (error) return handleError(res, error);
  res.json(Array.isArray(data) ? data : []);
});

app.post("/api/orders", async (req, res) => {
  const { data, error } = await supabaseAdmin.from('orders').insert(req.body).select();
  if (error) return handleError(res, error);
  res.json(data ? data[0] : null);
});

// Reviews
app.get("/api/reviews", async (req, res) => {
  let query = supabaseAdmin.from('reviews').select('*, profiles!buyer_id(name)');
  if (req.query.product_id) query = query.eq('product_id', req.query.product_id);
  const { data, error } = await query;
  if (error) return handleError(res, error);
  res.json(data || []);
});

export default app;