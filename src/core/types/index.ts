export type Category = 
  | 'céréales' 
  | 'tubercules' 
  | 'fruits' 
  | 'légumes' 
  | 'semences'
  | 'épices';

export interface Review {
  id: string;
  product_id: string;
  buyer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    name: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin';
  avatar_url?: string;
  phone?: string;
  city?: string;
  neighborhood?: string;
  language?: string;
  joined_at: string;
  bio?: string;
  status: 'pending' | 'active' | 'suspended';
  preferred_categories?: string[];
  rating?: number;
  location?: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
  lat?: number;
  lng?: number;
  region?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: Category;
  subcategory?: string;
  product_type?: string;
  images: string[];
  seller_id: string;
  seller_name: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
  stock: number;
  rating: number;
  reviews_count: number;
  created_at: string;
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
