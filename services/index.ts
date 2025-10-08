import { getApiClient } from './api';
import { 
  User, 
  Profile, 
  Restaurant, 
  RestaurantReview, 
  CategoryForm, 
  Payment,
  PaginatedResponse,
  CategoryType,
  FormData
} from '../types';

// Auth Service
export class AuthService {
  private api = getApiClient();

  async signInWithEmail(email: string, otp: string): Promise<User> {
    return this.api.post<User>('/auth/signin', { email, otp });
  }

  async signInWithPhone(phone: string, otp: string): Promise<User> {
    return this.api.post<User>('/auth/signin-phone', { phone, otp });
  }

  async sendOtp(email: string): Promise<void> {
    return this.api.post<void>('/auth/send-otp', { email });
  }

  async sendPhoneOtp(phone: string): Promise<void> {
    return this.api.post<void>('/auth/send-phone-otp', { phone });
  }

  async signOut(): Promise<void> {
    return this.api.post<void>('/auth/signout');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.api.get<User>('/auth/me');
    } catch {
      return null;
    }
  }

  async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    return this.api.put<Profile>('/auth/profile', profileData);
  }
}

// Restaurant Service
export class RestaurantService {
  private api = getApiClient();

  async getRestaurants(page = 1, limit = 20): Promise<PaginatedResponse<Restaurant>> {
    return this.api.get<PaginatedResponse<Restaurant>>(`/restaurants?page=${page}&limit=${limit}`);
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    return this.api.get<Restaurant>(`/restaurants/${id}`);
  }

  async getRestaurantReviews(restaurantId: string): Promise<RestaurantReview[]> {
    return this.api.get<RestaurantReview[]>(`/restaurants/${restaurantId}/reviews`);
  }

  async addRestaurantReview(restaurantId: string, rating: number, text?: string): Promise<RestaurantReview> {
    return this.api.post<RestaurantReview>(`/restaurants/${restaurantId}/reviews`, {
      rating,
      text,
    });
  }

  async updateRestaurantReview(reviewId: string, rating: number, text?: string): Promise<RestaurantReview> {
    return this.api.put<RestaurantReview>(`/reviews/${reviewId}`, {
      rating,
      text,
    });
  }

  async deleteRestaurantReview(reviewId: string): Promise<void> {
    return this.api.delete<void>(`/reviews/${reviewId}`);
  }
}

// Category Form Service
export class CategoryFormService {
  private api = getApiClient();

  async submitForm(category: CategoryType, formData: FormData, contactPhone: string): Promise<CategoryForm> {
    return this.api.post<CategoryForm>('/category-forms', {
      category,
      payload: formData,
      contact_phone: contactPhone,
    });
  }

  async getUserForms(): Promise<CategoryForm[]> {
    return this.api.get<CategoryForm[]>('/category-forms/my-forms');
  }

  async getFormById(id: string): Promise<CategoryForm> {
    return this.api.get<CategoryForm>(`/category-forms/${id}`);
  }
}

// Payment Service
export class PaymentService {
  private api = getApiClient();

  async createPayment(purpose: string, amount: number, provider: 'paytm' | 'phonepe'): Promise<Payment> {
    return this.api.post<Payment>('/payments', {
      purpose,
      amount,
      provider,
    });
  }

  async getPaymentById(id: string): Promise<Payment> {
    return this.api.get<Payment>(`/payments/${id}`);
  }

  async getUserPayments(): Promise<Payment[]> {
    return this.api.get<Payment[]>('/payments/my-payments');
  }

  async verifyPayment(paymentId: string, providerRef: string): Promise<Payment> {
    return this.api.post<Payment>(`/payments/${paymentId}/verify`, {
      provider_ref: providerRef,
    });
  }
}

// Subscription Service
export class SubscriptionService {
  private api = getApiClient();

  async getSubscriptionPlans(): Promise<any[]> {
    return this.api.get<any[]>('/subscriptions/plans');
  }

  async subscribeToPlan(planId: string, couponCode?: string): Promise<any> {
    return this.api.post<any>('/subscriptions/subscribe', {
      plan_id: planId,
      coupon_code: couponCode,
    });
  }

  async cancelSubscription(): Promise<void> {
    return this.api.post<void>('/subscriptions/cancel');
  }

  async getCurrentSubscription(): Promise<any> {
    return this.api.get<any>('/subscriptions/current');
  }
}

// Export service instances
export const authService = new AuthService();
export const restaurantService = new RestaurantService();
export const categoryFormService = new CategoryFormService();
export const paymentService = new PaymentService();
export const subscriptionService = new SubscriptionService();
