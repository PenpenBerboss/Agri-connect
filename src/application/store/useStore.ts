import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product } from '../../core/types';
import { MOCK_USERS, MOCK_PRODUCTS } from '../../services/mock/mockData';

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
  logout: () => void;
  register: (data: Partial<User>) => Promise<void>;
  
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

      login: async (email, _password) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const foundUser = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[0];
        set({ user: foundUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name || 'New User',
          email: data.email || '',
          role: data.role || 'buyer',
          joinedAt: new Date().toISOString().split('T')[0],
          ...data
        };
        set({ user: newUser, isAuthenticated: true });
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
