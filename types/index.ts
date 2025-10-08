// Core types for the application
export type UserRole = 'normal' | 'vip' | 'admin';

export interface User {
  id: string;
  email?: string;
  phone: string;
  name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  address_raw?: string;
  address_structured?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  lat?: number;
  lng?: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Legacy fields for backward compatibility
  category?: string;
  image?: string;
  specialist?: string[];
  menu?: any;
  discounts?: {
    normal_users: string;
    vip_users: string;
  };
  actions?: {
    book_table: string;
    takeaway?: boolean;
  };
  offers?: {
    cashback: string;
    payment: string;
  };
  photos?: string[];
  rating?: number;
  reviews?: number;
  distance?: string;
  prepTime?: string;
  openTime?: string;
  area?: string;
  priceForTwo?: string;
  opensIn?: string;
  savePercent?: number;
}

export interface RestaurantReview {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: number; // 1-5
  text?: string;
  created_at: string;
  updated_at: string;
}

// Category form types
export type CategoryType = 
  | 'hospital' 
  | 'home_service' 
  | 'events' 
  | 'construction' 
  | 'others' 
  | 'salon' 
  | 'shopping';

export interface CategoryForm {
  id: string;
  category: CategoryType;
  payload: Record<string, any>;
  contact_phone: string;
  submitted_by: string;
  created_at: string;
  sms_status: 'pending' | 'sent' | 'failed';
  sms_error?: string;
}

// Payment types
export interface Payment {
  id: string;
  user_id: string;
  purpose: string;
  amount: number; // in paise
  currency: string;
  status: 'created' | 'success' | 'failed';
  provider: 'paytm' | 'phonepe';
  provider_ref?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Subscription types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export interface UserSubscription {
  planId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  autoRenew: boolean;
  originalPrice?: number;
  pricePaid?: number;
  couponCode?: string | null;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form types for different categories
export interface HospitalFormData {
  patientName: string;
  phone: string;
  hospitalName: string;
  serviceType: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

export interface HomeServiceFormData {
  serviceType: string;
  address: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  description?: string;
}

export interface EventFormData {
  eventType: string;
  eventDate: string;
  guestCount: number;
  venue?: string;
  phone: string;
  requirements?: string;
}

export interface ConstructionFormData {
  projectType: string;
  materials: string[];
  phone: string;
  address: string;
  timeline?: string;
  budget?: string;
}

export interface SalonFormData {
  serviceType: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

export interface ShoppingFormData {
  itemType: string;
  phone: string;
  preferredDate?: string;
  budget?: string;
  requirements?: string;
}

export interface OthersFormData {
  serviceDescription: string;
  phone: string;
  preferredDate?: string;
  requirements?: string;
}

// Union type for all form data
export type FormData = 
  | HospitalFormData 
  | HomeServiceFormData 
  | EventFormData 
  | ConstructionFormData 
  | SalonFormData 
  | ShoppingFormData 
  | OthersFormData;
