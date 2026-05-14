export type Category = 
  | 'manioc' 
  | 'maïs' 
  | 'cacao' 
  | 'café' 
  | 'tomate' 
  | 'macabo' 
  | 'haricot' 
  | 'piment' 
  | 'plantain' 
  | 'arachide';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin';
  avatar?: string;
  phone?: string;
  location?: string;
  rating?: number;
  joinedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: Category;
  images: string[];
  sellerId: string;
  sellerName: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
  stock: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  views: number;
  isPopular?: boolean;
  isRecommended?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
