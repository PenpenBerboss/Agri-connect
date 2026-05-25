import axios from 'axios';

// Sur Vercel, si VITE_API_URL n'est pas défini, on utilise le chemin relatif.
// Si VITE_API_URL est défini (ex: https://mon-app.vercel.app), 
// on s'assure de ne pas doubler le /api
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  // Profiles (Admin)
  getProfiles: () => api.get('/api/profiles').then(res => res.data),
  getProfileById: (id: string) => api.get(`/api/profiles/${id}`).then(res => res.data),
  updateProfile: (id: string, profile: any) => api.put(`/api/profiles/${id}`, profile).then(res => res.data),
  updateProfileStatus: (id: string, status: string) => api.put(`/api/profiles/${id}/status`, { status }).then(res => res.data),
  deleteProfile: (id: string) => api.delete(`/api/profiles/${id}`).then(res => res.data),

  // Products
  getProducts: () => api.get('/api/products').then(res => res.data),
  createProduct: (product: any) => api.post('/api/products', product).then(res => res.data),
  updateProduct: (id: string, product: any) => api.put(`/api/products/${id}`, product).then(res => res.data),
  deleteProduct: (id: string) => api.delete(`/api/products/${id}`).then(res => res.data),
  recordProductView: (id: string) => api.post(`/api/products/${id}/view`).then(res => res.data),

  // Orders
  getOrders: () => api.get('/api/orders').then(res => res.data),
  createOrder: (order: any) => api.post('/api/orders', order).then(res => res.data),

  // Reviews
  getReviews: (productId?: string) => api.get('/api/reviews', { params: { product_id: productId } }).then(res => res.data),
  createReview: (review: any) => api.post('/api/reviews', review).then(res => res.data),
  deleteReview: (id: string) => api.delete(`/api/reviews/${id}`).then(res => res.data),
};
