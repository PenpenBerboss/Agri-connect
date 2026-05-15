import { Product, User } from '../types';
import { useStore } from '../../application/store/useStore';

/**
 * Advanced Hybrid Recommendation Service for AgriConnect Cameroon
 */
export class RecommendationService {
  /**
   * Calcul du score de recommandation hybride
   */
  static calculateHybridScore(
    product: Product,
    userId: string | null,
    contextProduct?: Product
  ): number {
    const user = useStore.getState().user;
    
    // 1. Content Scoring (Max 50 points) - 0.5 weight
    let contentScore = 0;
    if (contextProduct) {
      if (product.category === contextProduct.category) contentScore += 30;
      if (product.subcategory && contextProduct.subcategory && product.subcategory === contextProduct.subcategory) contentScore += 10;
      if (product.product_type && contextProduct.product_type && product.product_type === contextProduct.product_type) contentScore += 5;
      
      const commonKeywords = (product.keywords || []).filter(k => (contextProduct.keywords || []).includes(k));
      contentScore += Math.min(commonKeywords.length * 1, 5); 
    } else if (user?.preferred_categories?.includes(product.category)) {
      contentScore += 40;
    }

    // 2. Popularity Scoring (Max 30 points) - 0.3 weight
    let popularityScore = 0;
    popularityScore += (product.rating || 0) * 3; // Max 15
    popularityScore += Math.min(Math.log10((product.views || 0) + 1) * 3, 10); // Max 10
    popularityScore += Math.min((product.reviews_count || 0) * 1, 5); // Max 5

    // 3. Geographic Scoring (Max 20 points) - 0.2 weight
    let geoScore = 0;
    const userLat = user?.location?.lat || user?.lat || 4.05;
    const userLng = user?.location?.lng || user?.lng || 9.71;
    const targetLat = contextProduct ? contextProduct.location.lat : userLat;
    const targetLng = contextProduct ? contextProduct.location.lng : userLng;
    
    if (product.location) {
      const dist = Math.sqrt(
        Math.pow(targetLat - product.location.lat, 2) + 
        Math.pow(targetLng - product.location.lng, 2)
      );
      geoScore = Math.max(0, 20 - dist * 100);
    }

    return contentScore + popularityScore + geoScore;
  }

  static getRecommendedProducts(
    limit: number = 4,
    userId?: string,
    contextProduct?: Product
  ): Product[] {
    const products = useStore.getState().products;
    return [...products]
      .filter(p => !contextProduct || p.id !== contextProduct.id)
      .sort((a, b) => {
        const scoreA = this.calculateHybridScore(a, userId || null, contextProduct);
        const scoreB = this.calculateHybridScore(b, userId || null, contextProduct);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  static getNearbyProducts(lat: number, lng: number, limit: number = 4): Product[] {
    const products = useStore.getState().products;
    return [...products]
      .sort((a, b) => {
        if (!a.location || !b.location) return 0;
        const distA = Math.sqrt(Math.pow(lat - a.location.lat, 2) + Math.pow(lng - a.location.lng, 2));
        const distB = Math.sqrt(Math.pow(lat - b.location.lat, 2) + Math.pow(lng - b.location.lng, 2));
        return distA - distB;
      })
      .slice(0, limit);
  }

  static getTrendingProducts(limit: number = 4): Product[] {
    const products = useStore.getState().products;
    return [...products]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }

  static getPersonalRecommendations(userId: string, limit: number = 6): Product[] {
    const products = useStore.getState().products;
    // Use hybrid scoring for all products and take top
    return [...products]
      .sort((a, b) => {
        const scoreA = this.calculateHybridScore(a, userId, undefined);
        const scoreB = this.calculateHybridScore(b, userId, undefined);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }
}

// Legacy export for compatibility
export const getRecommendedProducts = (
  allProducts: Product[],
  limit: number = 4,
  userLocation: any,
  contextProduct?: Product
) => {
  return RecommendationService.getRecommendedProducts(limit, undefined, contextProduct);
};
