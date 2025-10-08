import { 
  Restaurant, 
  RestaurantReview, 
  CategoryForm, 
  Payment,
  User,
  Profile,
  CategoryType,
  FormData
} from '../types';
import { 
  authService, 
  restaurantService, 
  categoryFormService, 
  paymentService,
  subscriptionService 
} from '../services';

// Data layer that handles both static and dynamic data
export class DataLayer {
  // Static data fallbacks (will be replaced with API calls)
  private staticRestaurants: Restaurant[] = [];
  private staticReviews: RestaurantReview[] = [];

  // Cache for dynamic data
  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();

  constructor() {
    this.loadStaticData();
  }

  private loadStaticData() {
    // Load static data from constants (temporary)
    // This will be replaced with API calls
    try {
      // Import static data dynamically to avoid circular dependencies
      import('../constants/restaurantData').then(({ restaurantData }) => {
        // Convert static data to match our type structure
        const convertedRestaurants = restaurantData.map(restaurant => ({
          ...restaurant,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        this.staticRestaurants = convertedRestaurants;
      });
    } catch (error) {
      console.warn('Could not load static restaurant data:', error);
    }
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry) return false;
    return Date.now() < expiry;
  }

  private setCache(key: string, data: any, ttl = 300000): void { // 5 minutes default TTL
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + ttl);
  }

  private getCache(key: string): any {
    if (this.isCacheValid(key)) {
      return this.cache.get(key);
    }
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
    return null;
  }

  // Restaurant methods
  async getRestaurants(): Promise<Restaurant[]> {
    const cacheKey = 'restaurants';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Try to fetch from API first
      const response = await restaurantService.getRestaurants();
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch restaurants from API, using static data:', error);
      // Fallback to static data
      return this.staticRestaurants;
    }
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    const cacheKey = `restaurant_${id}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Try to fetch from API first
      const restaurant = await restaurantService.getRestaurantById(id);
      this.setCache(cacheKey, restaurant);
      return restaurant;
    } catch (error) {
      console.warn('Failed to fetch restaurant from API, using static data:', error);
      // Fallback to static data
      return this.staticRestaurants.find(r => r.id === id) || null;
    }
  }

  async getRestaurantReviews(restaurantId: string): Promise<RestaurantReview[]> {
    const cacheKey = `reviews_${restaurantId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Try to fetch from API first
      const reviews = await restaurantService.getRestaurantReviews(restaurantId);
      this.setCache(cacheKey, reviews);
      return reviews;
    } catch (error) {
      console.warn('Failed to fetch reviews from API, using static data:', error);
      // Fallback to static data
      return this.staticReviews.filter(r => r.restaurant_id === restaurantId);
    }
  }

  async addRestaurantReview(restaurantId: string, rating: number, text?: string): Promise<RestaurantReview> {
    try {
      const review = await restaurantService.addRestaurantReview(restaurantId, rating, text);
      // Invalidate cache
      this.cache.delete(`reviews_${restaurantId}`);
      return review;
    } catch (error) {
      console.error('Failed to add review:', error);
      throw error;
    }
  }

  // Category form methods
  async submitCategoryForm(category: CategoryType, formData: FormData, contactPhone: string): Promise<CategoryForm> {
    try {
      return await categoryFormService.submitForm(category, formData, contactPhone);
    } catch (error) {
      console.error('Failed to submit category form:', error);
      throw error;
    }
  }

  async getUserForms(): Promise<CategoryForm[]> {
    try {
      return await categoryFormService.getUserForms();
    } catch (error) {
      console.error('Failed to fetch user forms:', error);
      return [];
    }
  }

  // Payment methods
  async createPayment(purpose: string, amount: number, provider: 'paytm' | 'phonepe'): Promise<Payment> {
    try {
      return await paymentService.createPayment(purpose, amount, provider);
    } catch (error) {
      console.error('Failed to create payment:', error);
      throw error;
    }
  }

  async getUserPayments(): Promise<Payment[]> {
    try {
      return await paymentService.getUserPayments();
    } catch (error) {
      console.error('Failed to fetch user payments:', error);
      return [];
    }
  }

  // Auth methods
  async getCurrentUser(): Promise<User | null> {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    try {
      return await authService.updateProfile(profileData);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  // Subscription methods
  async getSubscriptionPlans(): Promise<any[]> {
    try {
      return await subscriptionService.getSubscriptionPlans();
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
      return [];
    }
  }

  async subscribeToPlan(planId: string, couponCode?: string): Promise<any> {
    try {
      return await subscriptionService.subscribeToPlan(planId, couponCode);
    } catch (error) {
      console.error('Failed to subscribe to plan:', error);
      throw error;
    }
  }

  // Utility methods
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  clearCacheForKey(key: string): void {
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }
}

// Singleton instance
export const dataLayer = new DataLayer();
