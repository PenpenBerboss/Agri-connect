import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product } from '../../core/types';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';

interface CartItem {
  productId: string;
  quantity: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  favorites: string[]; // IDs of products
  products: Product[];
  reviews: any[];
  cart: CartItem[];

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  checkAuth: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;

  // Favorites actions
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Cart actions
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Product fetching (mock)
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;

  // Reviews
  fetchReviews: (productId?: string) => Promise<void>;
  addReview: (review: any) => Promise<void>;
  recordProductView: (productId: string) => Promise<void>;

  // Orders
  orders: any[];
  fetchOrders: () => Promise<void>;
  createOrder: (order: any) => Promise<void>;
}

function isProfileMissingError(err: unknown): boolean {
  const anyErr = err as { code?: string; message?: string; hint?: string } | undefined;
  const code = anyErr?.code ?? anyErr?.hint ?? '';
  const msg = String(anyErr?.message ?? '');
  return code === 'PGRST116' || msg.toLowerCase().includes('single row');
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      favorites: [],
      products: [],
      cart: [],
      orders: [],
      reviews: [],

      login: async (email, password) => {
        await authService.signIn({ email, password });
        const user = await authService.getCurrentUser();

        if (!user) return;

        try {
          const profile = await apiService.getProfileById(user.id);
          set({ user: { ...user, ...profile } as any, isAuthenticated: true });
        } catch (err) {
          if (isProfileMissingError(err)) {
            set({ user: user as any, isAuthenticated: true });
            return;
          }
          throw err;
        }
      },

      logout: async () => {
        await authService.signOut();
        set({ user: null, isAuthenticated: false, products: [] });
      },

      register: async (data) => {
        await authService.signUp({
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role,
        });

        const user = await authService.getCurrentUser();
        if (!user) return;

        try {
          const profile = await apiService.getProfileById(user.id);
          set({ user: { ...user, ...profile } as any, isAuthenticated: true });
        } catch (err) {
          if (isProfileMissingError(err)) {
            set({ user: user as any, isAuthenticated: true });
            return;
          }
          throw err;
        }
      },

      checkAuth: async () => {
        const user = await authService.getCurrentUser();
        if (!user) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          const profile = await apiService.getProfileById(user.id);
          set({ user: { ...user, ...profile } as any, isAuthenticated: true });
        } catch (err) {
          if (isProfileMissingError(err)) {
            set({ user: user as any, isAuthenticated: true });
            return;
          }
          throw err;
        }
      },

      signInWithGoogle: async () => {
        await authService.signInWithGoogle();
      },

      signInWithFacebook: async () => {
        await authService.signInWithFacebook();
      },

      toggleFavorite: (productId) => {
        const { favorites } = get();
        if (favorites.includes(productId)) {
          set({ favorites: favorites.filter((id) => id !== productId) });
        } else {
          set({ favorites: [...favorites, productId] });
        }
      },

      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },

      addToCart: (productId, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.productId === productId);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({ cart: [...cart, { productId, quantity }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      fetchOrders: async () => {
        const orders = await apiService.getOrders();
        set({ orders });
      },

      createOrder: async (orderData) => {
        const newOrder = await apiService.createOrder(orderData);
        set({ orders: [newOrder, ...get().orders] });
      },

      fetchProducts: async () => {
        const products = await apiService.getProducts();
        set({ products });
      },

      addProduct: async (product) => {
        const newProduct = await apiService.createProduct(product);
        set({ products: [newProduct, ...get().products] });
      },

      updateProduct: async (product) => {
        const updatedProduct = await apiService.updateProduct(product.id, product);
        set({
          products: get().products.map((p) => (p.id === product.id ? updatedProduct : p)),
        });
      },

      deleteProduct: async (productId) => {
        await apiService.deleteProduct(productId);
        set({
          products: get().products.filter((p) => p.id !== productId),
        });
      },

      fetchReviews: async (productId) => {
        const reviews = await apiService.getReviews(productId);
        set({ reviews });
      },

      addReview: async (reviewData) => {
        const newReview = await apiService.createReview(reviewData);
        set({ reviews: [newReview, ...get().reviews] });
        const products = await apiService.getProducts();
        set({ products });
      },

      recordProductView: async (productId) => {
        try {
          const updatedProduct = await apiService.recordProductView(productId);
          const products = get().products.map((p) => (p.id === productId ? updatedProduct : p));
          set({ products });
        } catch (error) {
          console.error('Error recording view', error);
        }
      },

      updateProfile: async (profileData) => {
        const { user } = get();
        if (!user) return;
        const updatedProfile = await apiService.updateProfile(user.id, profileData);
        set({ user: { ...user, ...updatedProfile } });
      },
    }),
    {
      name: 'agriconnect-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        cart: state.cart,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        products: state.products,
      }),
    },
  ),
);
