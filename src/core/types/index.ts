export type Category = 
  | 'céréales' 
  | 'tubercules' 
  | 'fruits' 
  | 'légumes' 
  | 'semences' 
  | 'engrais';

export interface Review {
  id: string;
  productId: string;
  sellerId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin';
  avatar?: string;
  phone?: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
  rating?: number;
  joinedAt: string;
  bio?: string;
  preferred_categories?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: Category;
  subcategory?: string;
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
  harvest_period?: string;
  season?: string;
  availability_status?: string;
  favorites_count?: number;
  contact_count?: number;
  recommendation_tags?: string[];
  keywords?: string[];
}
