import axios from 'axios';

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
  // Profiles (Admin)
  getProfiles: () => api.get('/profiles').then(res => res.data),
  getProfileById: (id: string) => api.get(`/profiles/${id}`).then(res => res.data),
  updateProfile: (id: string, profile: any) => api.put(`/profiles/${id}`, profile).then(res => res.data),
  updateProfileStatus: (id: string, status: string) => api.put(`/profiles/${id}/status`, { status }).then(res => res.data),
  deleteProfile: (id: string) => api.delete(`/profiles/${id}`).then(res => res.data),

  // Products
  getProducts: () => api.get('/products').then(res => res.data),
  createProduct: (product: any) => api.post('/products', product).then(res => res.data),
  updateProduct: (id: string, product: any) => api.put(`/products/${id}`, product).then(res => res.data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`).then(res => res.data),
  recordProductView: (id: string) => api.post(`/products/${id}/view`).then(res => res.data),

  // Orders
  getOrders: () => api.get('/orders').then(res => res.data),
  createOrder: (order: any) => api.post('/orders', order).then(res => res.data),

  // Reviews
  getReviews: (productId?: string) => api.get('/reviews', { params: { product_id: productId } }).then(res => res.data),
  createReview: (review: any) => api.post('/reviews', review).then(res => res.data),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`).then(res => res.data),
};
