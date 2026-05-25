import express, { type Express, type Request, type Response } from 'express';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

type DbPayload = Record<string, unknown>;

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
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

function handleError(res: Response, error: { message?: string; code?: string }) {
  const status = error.code === 'PGRST116' ? 404 : 500;
  return res.status(status).json({ error: error.message || 'Internal Server Error' });
}

function normalizeProductList<T>(data: T[] | null | undefined): T[] {
  return Array.isArray(data) ? data : [];
}

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.get('/api/profiles', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseAdmin().from('profiles').select('*');
      if (error) return handleError(res, error);
      return res.json(normalizeProductList(data));
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.get('/api/profiles/:id', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseAdmin().from('profiles').select('*').eq('id', req.params.id).single();
      if (error) return handleError(res, error);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.put('/api/profiles/:id', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseAdmin().from('profiles').update(req.body as DbPayload).eq('id', req.params.id).select();
      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.put('/api/profiles/:id/status', async (req: Request, res: Response) => {
    try {
      const { status } = req.body as { status?: string };
      if (!status || !['pending', 'active', 'suspended'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const { data, error } = await getSupabaseAdmin()
        .from('profiles')
        .update({ status })
        .eq('id', req.params.id)
        .select();

      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.delete('/api/profiles/:id', async (req: Request, res: Response) => {
    try {
      const { error: profileError } = await getSupabaseAdmin().from('profiles').delete().eq('id', req.params.id);
      if (profileError) return handleError(res, profileError);

      await getSupabaseAdmin().auth.admin.deleteUser(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.get('/api/products', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseAdmin().from('products').select('*').order('created_at', { ascending: false });
      if (error) return handleError(res, error);
      return res.json(normalizeProductList(data));
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/products', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseAdmin().from('products').insert(req.body as DbPayload).select();
      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.put('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('products')
        .update(req.body as DbPayload)
        .eq('id', req.params.id)
        .select();

      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/products/:id/view', async (req: Request, res: Response) => {
    try {
      const { data: product, error: fetchError } = await getSupabaseAdmin().from('products').select('views').eq('id', req.params.id).single();
      if (fetchError) return handleError(res, fetchError);

      const currentViews = typeof product?.views === 'number' ? product.views : Number(product?.views ?? 0);
      const { data, error } = await getSupabaseAdmin()
        .from('products')
        .update({ views: currentViews + 1 })
        .eq('id', req.params.id)
        .select();

      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const { error } = await getSupabaseAdmin().from('products').delete().eq('id', req.params.id);
      if (error) return handleError(res, error);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.get('/api/orders', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseAdmin().from('orders').select('*, products(name)');
      if (error) return handleError(res, error);
      return res.json(normalizeProductList(data));
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseAdmin().from('orders').insert(req.body as DbPayload).select();
      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.get('/api/reviews', async (req: Request, res: Response) => {
    try {
      let query = getSupabaseAdmin().from('reviews').select('*, profiles!buyer_id(name)');

      if (req.query.product_id) {
        query = query.eq('product_id', String(req.query.product_id));
      }

      const { data, error } = await query;
      if (error) return handleError(res, error);
      return res.json(normalizeProductList(data));
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/reviews', async (req: Request, res: Response) => {
    try {
      const { data: review, error: reviewError } = await getSupabaseAdmin().from('reviews').insert(req.body as DbPayload).select().single();
      if (reviewError) return handleError(res, reviewError);

      const productId = String((req.body as { product_id?: string }).product_id || '');
      if (productId) {
        const { data: reviews, error: reviewsError } = await getSupabaseAdmin().from('reviews').select('rating').eq('product_id', productId);

        if (!reviewsError && reviews && reviews.length > 0) {
          const count = reviews.length;
          const average = reviews.reduce((sum, current) => sum + Number(current.rating || 0), 0) / count;

          await getSupabaseAdmin().from('products').update({
            rating: average,
            reviews_count: count,
          }).eq('id', productId);
        }
      }

      return res.json(review);
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.delete('/api/reviews/:id', async (req: Request, res: Response) => {
    try {
      const { error } = await getSupabaseAdmin().from('reviews').delete().eq('id', req.params.id);
      if (error) return handleError(res, error);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  return app;
}
