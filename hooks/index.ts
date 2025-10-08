import { useState, useEffect, useCallback } from 'react';
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
import { dataLayer } from '../data';

// Generic hook for data fetching with loading and error states
function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Restaurant hooks
export function useRestaurants() {
  return useAsyncData(() => dataLayer.getRestaurants());
}

export function useRestaurant(id: string) {
  return useAsyncData(() => dataLayer.getRestaurantById(id), [id]);
}

export function useRestaurantReviews(restaurantId: string) {
  return useAsyncData(() => dataLayer.getRestaurantReviews(restaurantId), [restaurantId]);
}

export function useAddRestaurantReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addReview = useCallback(async (
    restaurantId: string, 
    rating: number, 
    text?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const review = await dataLayer.addRestaurantReview(restaurantId, rating, text);
      return review;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addReview, loading, error };
}

// Category form hooks
export function useSubmitCategoryForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = useCallback(async (
    category: CategoryType, 
    formData: FormData, 
    contactPhone: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataLayer.submitCategoryForm(category, formData, contactPhone);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitForm, loading, error };
}

export function useUserForms() {
  return useAsyncData(() => dataLayer.getUserForms());
}

// Payment hooks
export function useCreatePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (
    purpose: string, 
    amount: number, 
    provider: 'paytm' | 'phonepe'
  ) => {
    try {
      setLoading(true);
      setError(null);
      const payment = await dataLayer.createPayment(purpose, amount, provider);
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPayment, loading, error };
}

export function useUserPayments() {
  return useAsyncData(() => dataLayer.getUserPayments());
}

// Auth hooks
export function useCurrentUser() {
  return useAsyncData(() => dataLayer.getCurrentUser());
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (profileData: Partial<Profile>) => {
    try {
      setLoading(true);
      setError(null);
      const profile = await dataLayer.updateProfile(profileData);
      return profile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProfile, loading, error };
}

// Subscription hooks
export function useSubscriptionPlans() {
  return useAsyncData(() => dataLayer.getSubscriptionPlans());
}

export function useSubscribeToPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (planId: string, couponCode?: string) => {
    try {
      setLoading(true);
      setError(null);
      const subscription = await dataLayer.subscribeToPlan(planId, couponCode);
      return subscription;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { subscribe, loading, error };
}

// Utility hook for cache management
export function useCacheManager() {
  const clearCache = useCallback(() => {
    dataLayer.clearCache();
  }, []);

  const clearCacheForKey = useCallback((key: string) => {
    dataLayer.clearCacheForKey(key);
  }, []);

  return { clearCache, clearCacheForKey };
}
