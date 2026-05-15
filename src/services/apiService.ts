import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Une erreur est survenue';
    console.error('API Error:', {
      status: error.response?.status,
      message: message,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(new Error(message));
  }
);

export const apiService = {
  // Profiles
  // IMPORTANT: pour les listes (getProfiles / getProducts), on lit directement Supabase
  // afin d'éviter les problèmes d'exposition / routes backend dans certains environnements.
  getProfiles: async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    return data;
  },

  getProfileById: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  createProfile: async (profile: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateProfile: (id: string, profile: any) => api.put(`/profiles/${id}`, profile).then(res => res.data),
  updateProfileStatus: (id: string, status: string) => api.put(`/profiles/${id}/status`, { status }).then(res => res.data),
  deleteProfile: (id: string) => api.delete(`/profiles/${id}`).then(res => res.data),

  // Products
  getProducts: async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  },

  createProduct: (product: any) => api.post('/products', product).then(res => res.data),
  updateProduct: (id: string, product: any) => api.put(`/products/${id}`, product).then(res => res.data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`).then(res => res.data),
  recordProductView: (id: string) => api.post(`/products/${id}/view`).then(res => res.data),

  // Orders
  // IMPORTANT: sur Vercel, backend Express (/api/*) peut ne pas être exposé => on lit via Supabase directement.
  getOrders: async () => {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) throw error;
    return data;
  },
  // Orders (lecture via Supabase, écriture aussi pour éviter /api non exposés)
  createOrder: async (order: any) => {
    const { data, error } = await supabase.from('orders').insert(order).select().single();
    if (error) throw error;
    return data;
  },

  // Reviews (écriture via Supabase aussi pour éviter /api non exposés)
  getReviews: (productId?: string) => api.get('/reviews', { params: { product_id: productId } }).then(res => res.data),
  createReview: async (review: any) => {
    // Insert review
    const { data: insertedReview, error: insertError } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    if (insertError) throw insertError;

    // Update product rating & reviews_count (même logique que server.ts)
    const productId = review.product_id as string;
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (!reviewsError && reviews) {
      const count = reviews.length;
      const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / count;

      const { error: updateError } = await supabase
        .from('products')
        .update({ rating: avg, reviews_count: count })
        .eq('id', productId);

      if (updateError) throw updateError;
    }

    return insertedReview;
  },
  deleteReview: async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};
