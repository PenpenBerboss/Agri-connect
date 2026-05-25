import express, { type Express, type Request, type Response } from 'express';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

type DbPayload = Record<string, unknown>;

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    // Pour les fonctions serverless Vercel, nous nous attendons à ces variables d'environnement spécifiques.
    // Les variables préfixées par VITE_ sont généralement pour le frontend.
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      // Loggue des informations spécifiques pour faciliter le débogage sur Vercel
      console.error('CRITICAL: Variables d\'environnement Supabase côté serveur manquantes.');
      console.error(`  SUPABASE_URL: ${url ? 'CONFIGURÉE' : 'NON CONFIGURÉE'}`);
      console.error(`  SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? 'CONFIGURÉE' : 'NON CONFIGURÉE'}`);
      throw new Error('Variables d\'environnement Supabase côté serveur (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) sont requises.');
    }

    supabaseClient = createClient(url, serviceKey); // Utilise toujours la serviceKey pour un client admin
  }

  return supabaseClient;
}

function handleError(res: Response, error: { message?: string; code?: string; details?: string; hint?: string }) {
  console.error('Backend Error Details:', error);
  
  const status = error.code === 'PGRST116' ? 404 : 500;
  return res.status(status).json({
    error: typeof error.message === 'string' ? error.message : 'Internal Server Error',
    status: 'error',
    code: error.code || 'UNKNOWN_ERROR',
    details: error.details || null,
    hint: error.hint || null
  });
}

function normalizeList<T>(data: T[] | null | undefined): T[] {
  return Array.isArray(data) ? data : [];
}

function sortByCreatedAtDescending<T extends { created_at?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.created_at || 0).getTime();
    const bTime = new Date(b.created_at || 0).getTime();
    return bTime - aTime;
  });
}

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.get('/api/profiles', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseClient().from('profiles').select('*');
      if (error) return handleError(res, error);
      return res.json(normalizeList(data));
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.get('/api/profiles/:id', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseClient().from('profiles').select('*').eq('id', req.params.id).single();
      if (error) return handleError(res, error);
      return res.json(data);
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.put('/api/profiles/:id', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseClient().from('profiles').update(req.body as DbPayload).eq('id', req.params.id).select();
      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.put('/api/profiles/:id/status', async (req: Request, res: Response) => {
    try {
      const { status } = req.body as { status?: string };
      if (!status || !['pending', 'active', 'suspended'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const { data, error } = await getSupabaseClient()
        .from('profiles')
        .update({ status })
        .eq('id', req.params.id)
        .select();

      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.delete('/api/profiles/:id', async (req: Request, res: Response) => {
    try {
      const { error: profileError } = await getSupabaseClient().from('profiles').delete().eq('id', req.params.id);
      if (profileError) return handleError(res, profileError);

      await getSupabaseClient().auth.admin.deleteUser(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.get('/api/products', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseClient().from('products').select('*');
      if (error) return handleError(res, error);
      return res.json(sortByCreatedAtDescending(normalizeList(data)));
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.post('/api/products', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseClient().from('products').insert(req.body as DbPayload).select();
      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.put('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseClient()
        .from('products')
        .update(req.body as DbPayload)
        .eq('id', req.params.id)
        .select();

      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null); // S'assurer que les données sont retournées
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.post('/api/products/:id/view', async (req: Request, res: Response) => {
    try {
      const { data: product, error: fetchError } = await getSupabaseClient().from('products').select('views').eq('id', req.params.id).single();
      if (fetchError) return handleError(res, fetchError);

      const currentViews = typeof product?.views === 'number' ? product.views : Number(product?.views ?? 0);
      const { data, error } = await getSupabaseClient()
        .from('products')
        .update({ views: currentViews + 1 })
        .eq('id', req.params.id)
        .select();

      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null); // S'assurer que les données sont retournées
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const { error } = await getSupabaseClient().from('products').delete().eq('id', req.params.id);
      if (error) return handleError(res, error);
      return res.json({ success: true });
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.get('/api/orders', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseClient().from('orders').select('*');
      if (error) return handleError(res, error);
      return res.json(sortByCreatedAtDescending(normalizeList(data)));
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseClient().from('orders').insert(req.body as DbPayload).select();
      if (error) return handleError(res, error);
      return res.json(data?.[0] ?? null);
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.get('/api/reviews', async (req: Request, res: Response) => {
    try {
      let query = getSupabaseClient().from('reviews').select('*');

      if (req.query.product_id) {
        query = query.eq('product_id', String(req.query.product_id));
      }

      const { data, error } = await query;
      if (error) return handleError(res, error);
      return res.json(sortByCreatedAtDescending(normalizeList(data)));
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.post('/api/reviews', async (req: Request, res: Response) => {
    try {
      const { data: review, error: reviewError } = await getSupabaseClient().from('reviews').insert(req.body as DbPayload).select().single();
      if (reviewError) return handleError(res, reviewError);

      const productId = String((req.body as { product_id?: string }).product_id || '');
      if (productId) {
        const { data: reviews, error: reviewsError } = await getSupabaseClient().from('reviews').select('rating').eq('product_id', productId);

        if (!reviewsError && reviews && reviews.length > 0) {
          const count = reviews.length;
          const average = reviews.reduce((sum, current) => sum + Number(current.rating || 0), 0) / count;

          await getSupabaseClient().from('products').update({
            rating: average,
            reviews_count: count,
          }).eq('id', productId);
        }
      }

      return res.json(review);
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  app.delete('/api/reviews/:id', async (req: Request, res: Response) => {
    try {
      const { error } = await getSupabaseClient().from('reviews').delete().eq('id', req.params.id);
      if (error) return handleError(res, error);
      return res.json({ success: true });
    } catch (error) {
      return handleError(res, error instanceof Error ? { message: error.message } : { message: 'Internal Server Error' });
    }
  });

  return app;
}
