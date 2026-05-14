import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product } from '../../core/types';
import { MOCK_PRODUCTS } from '../../services/mock/mockData';
import { authService } from '../../services/authService';

interface CartItem {
  productId: string;
  quantity: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  favorites: string[]; // IDs of products
  products: Product[];
  cart: CartItem[];
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  
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
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      favorites: [],
      products: MOCK_PRODUCTS,
      cart: [],

      login: async (email, password) => {
        await authService.signIn({ email, password });
        const user = await authService.getCurrentUser();
        set({ user: user as any, isAuthenticated: true });
      },

      logout: async () => {
        await authService.signOut();
        set({ user: null, isAuthenticated: false });
      },

      register: async (data) => {
        await authService.signUp({
            email: data.email,
            password: data.password,
            name: data.name,
            role: data.role
        });
        const user = await authService.getCurrentUser();
        set({ user: user as any, isAuthenticated: true });
      },

      toggleFavorite: (productId) => {
        const { favorites } = get();
        if (favorites.includes(productId)) {
          set({ favorites: favorites.filter(id => id !== productId) });
        } else {
          set({ favorites: [...favorites, productId] });
        }
      },

      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },

      addToCart: (productId, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.productId === productId);
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { productId, quantity }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      fetchProducts: async () => {
        // Mock fetch
        set({ products: MOCK_PRODUCTS });
      },

      addProduct: (product) => {
        set({ products: [product, ...get().products] });
      },

      updateProduct: (product) => {
        set({
          products: get().products.map(p => p.id === product.id ? product : p)
        });
      },

      deleteProduct: (productId) => {
        set({
          products: get().products.filter(p => p.id !== productId)
        });
      }
    }),
    {
      name: 'agriconnect-storage',
      partialize: (state) => ({ 
        favorites: state.favorites,
        cart: state.cart,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        products: state.products
      }),
    }
  )
);
