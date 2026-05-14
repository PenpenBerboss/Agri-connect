import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const apiService = {
  // Profiles (Admin)
  getProfiles: () => api.get('/profiles').then(res => res.data),
  getProfileById: (id: string) => api.get(`/profiles/${id}`).then(res => res.data),
  updateProfileStatus: (id: string, status: string) => api.put(`/profiles/${id}/status`, { status }).then(res => res.data),

  // Products
  getProducts: () => api.get('/products').then(res => res.data),
  createProduct: (product: any) => api.post('/products', product).then(res => res.data),
  updateProduct: (id: string, product: any) => api.put(`/products/${id}`, product).then(res => res.data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`).then(res => res.data),

  // Orders
  getOrders: () => api.get('/orders').then(res => res.data),
  createOrder: (order: any) => api.post('/orders', order).then(res => res.data),
};
