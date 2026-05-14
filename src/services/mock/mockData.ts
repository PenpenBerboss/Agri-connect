import { Product, User, Category, Review } from '../../core/types';
import massiveData from './generatedMassiveData.json';

// Export massive data for recommendation system
export const MOCK_PRODUCTS: Product[] = massiveData.products as unknown as Product[];
export const MOCK_USERS: User[] = [
  ...massiveData.users as unknown as User[],
  {
    id: 'admin-1',
    name: 'Administrateur',
    email: 'admin@agriconnect.com',
    role: 'admin',
    joinedAt: '2024-01-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  }
];
export const MOCK_HISTORY = massiveData.history;
export const MOCK_REVIEWS: Review[] = massiveData.reviews as unknown as Review[];

export const MASSIVE_PRODUCTS = MOCK_PRODUCTS;
export const MASSIVE_USERS = MOCK_USERS;
export const MASSIVE_HISTORY = MOCK_HISTORY;
export const MASSIVE_REVIEWS = MOCK_REVIEWS;

export const CATEGORIES: { label: string; value: Category; icon: string; imagePath?: string }[] = [
  { label: 'Céréales', value: 'céréales', icon: '🌾', imagePath: '/assets/cereale.jpg' },
  { label: 'Tubercules', value: 'tubercules', icon: '🍠', imagePath: '/assets/tubercule.jpg' },
  { label: 'Fruits', value: 'fruits', icon: '🍍', imagePath: '/assets/fruit.jpg' },
  { label: 'Légumes', value: 'légumes', icon: '🥬', imagePath: '/assets/legume.jpg' },
  { label: 'Semences', value: 'semences', icon: '🌱', imagePath: '/assets/semence.jpg' },
];

export const CAMEROON_CITIES = [
  'Douala',
  'Yaoundé',
  'Bafoussam',
  'Garoua',
  'Bertoua',
  'Bamenda',
  'Kribi'
];

export const MOCK_STATS = [
  { name: 'Jan', sales: 4000, products: 240 },
  { name: 'Feb', sales: 3000, products: 198 },
  { name: 'Mar', sales: 2000, products: 980 },
  { name: 'Apr', sales: 2780, products: 390 },
  { name: 'May', sales: 1890, products: 480 },
  { name: 'Jun', sales: 2390, products: 380 },
];

export const MOCK_ORDERS = [
  {
    id: 'ord-1254',
    customerName: 'Marie Eteki',
    productName: 'Plantain Mûre de Njombé',
    quantity: 5,
    unit: 'régime',
    amount: 17500,
    status: 'delivered',
    date: '2024-05-12',
    paymentMethod: 'Orange Money',
  },
  {
    id: 'ord-1255',
    customerName: 'Lucas Bernard',
    productName: 'Cacao Supérieur Foumban',
    quantity: 10,
    unit: 'kg',
    amount: 12500,
    status: 'processing',
    date: '2024-05-13',
    paymentMethod: 'MTN MoMo',
  },
  {
    id: 'ord-1256',
    customerName: 'Sandra Tagne',
    productName: 'Café Arabica Ouest',
    quantity: 2,
    unit: 'sachet',
    amount: 5000,
    status: 'pending',
    date: '2024-05-14',
    paymentMethod: 'Espèces',
  },
  {
    id: 'ord-1257',
    customerName: 'Paul Kamdem',
    productName: 'Piment de Penja',
    quantity: 1,
    unit: 'seau',
    amount: 1500,
    status: 'cancelled',
    date: '2024-05-10',
    paymentMethod: 'Orange Money',
  }
];
