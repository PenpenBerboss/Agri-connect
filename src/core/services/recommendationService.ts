import { Product, User } from '../types';
import { MOCK_PRODUCTS, MOCK_HISTORY, MOCK_USERS } from '../../services/mock/mockData';

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
    const user = userId ? MOCK_USERS.find(u => u.id === userId) : null;
    let score = 0;

    // 1. Content Similarity (0.4)
    if (contextProduct) {
      if (product.category === contextProduct.category) score += 40;
      if (product.subcategory === (contextProduct as any).subcategory) score += 20;
    }

    // 2. Collaborative Filtering (0.3)
    // Find if other users who liked contextProduct also liked this product
    if (contextProduct && MOCK_HISTORY) {
      const coOccurrences = MOCK_HISTORY.filter(h => 
        h.product_id === product.id && 
        MOCK_HISTORY.find(h2 => h2.product_id === contextProduct.id && h2.user_id === h.user_id)
      ).length;
      score += Math.min(coOccurrences * 2, 30);
    }

    // 3. Popularity & Quality (0.2)
    score += (product.rating || 0) * 4;
    score += Math.min((product.views || 0) / 100, 10);

    // 4. Geographic Proximity (0.1)
    if (user && user.location) {
      const dist = Math.sqrt(Math.pow(user.location.lat - product.location.lat, 2) + Math.pow(user.location.lng - product.location.lng, 2));
      score += Math.max(0, 10 - dist * 20);
    }

    return score;
  }

  static getRecommendedProducts(
    limit: number = 4,
    userId?: string,
    contextProduct?: Product
  ): Product[] {
    return [...MOCK_PRODUCTS]
      .filter(p => !contextProduct || p.id !== contextProduct.id)
      .sort((a, b) => {
        const scoreA = this.calculateHybridScore(a, userId || null, contextProduct);
        const scoreB = this.calculateHybridScore(b, userId || null, contextProduct);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  static getNearbyProducts(lat: number, lng: number, limit: number = 4): Product[] {
    return [...MOCK_PRODUCTS]
      .sort((a, b) => {
        const distA = Math.sqrt(Math.pow(lat - a.location.lat, 2) + Math.pow(lng - a.location.lng, 2));
        const distB = Math.sqrt(Math.pow(lat - b.location.lat, 2) + Math.pow(lng - b.location.lng, 2));
        return distA - distB;
      })
      .slice(0, limit);
  }

  static getTrendingProducts(limit: number = 4): Product[] {
    return [...MOCK_PRODUCTS]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }

  static getPersonalRecommendations(userId: string, limit: number = 6): Product[] {
    const user = MOCK_USERS.find(u => u.id === userId);
    // Use hybrid scoring for all products and take top
    return [...MOCK_PRODUCTS]
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
