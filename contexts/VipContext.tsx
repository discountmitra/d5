import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, SubscriptionPlan, UserSubscription } from '../types';
import { subscriptionService } from '../services';
import { useAuth } from './AuthContext';

export type UserMode = 'normal' | 'vip';

interface VipContextType {
  userMode: UserMode;
  isVip: boolean;
  subscription: UserSubscription | null;
  subscriptionPlans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  subscribeToPlan: (
    planId: string,
    options?: { couponCode?: string; discountPct?: number; finalPrice?: number }
  ) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  getSubscriptionStatus: () => {
    isActive: boolean;
    daysRemaining: number;
    planName: string;
  };
  refreshSubscription: () => Promise<void>;
}

const VipContext = createContext<VipContextType | undefined>(undefined);

interface VipProviderProps {
  children: ReactNode;
}

// Fallback subscription plans (will be replaced with API data)
const FALLBACK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly VIP',
    price: 299,
    duration: '1 Month',
    features: [
      'Unlimited service requests',
      'Free booking for all services',
      'Priority customer support',
      'Exclusive deals and offers',
      '2X faster service delivery'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly VIP',
    price: 799,
    duration: '3 Months',
    features: [
      'Everything in Monthly VIP',
      '15% additional savings',
      'Free home delivery',
      'Personal service manager',
      'Early access to new features'
    ],
    popular: true
  },
  {
    id: 'yearly',
    name: 'Yearly VIP',
    price: 2499,
    duration: '12 Months',
    features: [
      'Everything in Quarterly VIP',
      '30% additional savings',
      'Free premium services',
      '24/7 dedicated support',
      'Lifetime feature updates'
    ]
  }
];

export function VipProvider({ children }: VipProviderProps) {
  const { authState } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(FALLBACK_SUBSCRIPTION_PLANS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Derive userMode and isVip from user role
  const userMode: UserMode = authState.user?.role === 'vip' ? 'vip' : 'normal';
  const isVip = authState.user?.role === 'vip';

  // Load subscription plans and current subscription on mount
  useEffect(() => {
    loadSubscriptionData();
  }, [authState.user]);

  const loadSubscriptionData = async () => {
    if (!authState.user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load subscription plans
      const plans = await subscriptionService.getSubscriptionPlans();
      if (plans.length > 0) {
        setSubscriptionPlans(plans);
      }
      
      // Load current subscription
      const currentSubscription = await subscriptionService.getCurrentSubscription();
      if (currentSubscription) {
        setSubscription(currentSubscription);
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (
    planId: string,
    options?: { couponCode?: string; discountPct?: number; finalPrice?: number }
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await subscriptionService.subscribeToPlan(planId, options?.couponCode);
      
      if (result) {
        // Refresh subscription data
        await loadSubscriptionData();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Subscription failed:', error);
      setError('Failed to subscribe to plan');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await subscriptionService.cancelSubscription();
      
      // Refresh subscription data
      await loadSubscriptionData();
      
      return true;
    } catch (error) {
      console.error('Cancellation failed:', error);
      setError('Failed to cancel subscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatus = () => {
    if (!subscription || !subscription.isActive) {
      return { isActive: false, daysRemaining: 0, planName: 'No Active Plan' };
    }

    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const plan = subscriptionPlans.find(p => p.id === subscription.planId);
    
    return {
      isActive: daysRemaining > 0,
      daysRemaining: Math.max(0, daysRemaining),
      planName: plan?.name || 'Unknown Plan'
    };
  };

  const refreshSubscription = async () => {
    await loadSubscriptionData();
  };

  const value: VipContextType = {
    userMode,
    isVip,
    subscription,
    subscriptionPlans,
    loading,
    error,
    subscribeToPlan,
    cancelSubscription,
    getSubscriptionStatus,
    refreshSubscription,
  };

  return (
    <VipContext.Provider value={value}>
      {children}
    </VipContext.Provider>
  );
}

export function useVip() {
  const context = useContext(VipContext);
  if (context === undefined) {
    throw new Error('useVip must be used within a VipProvider');
  }
  return context;
}

// Helper function to get VIP pricing
export function getVipPrice(basePrice: number, isVip: boolean, vipDiscount: number = 0.5): { normal: number; vip: number; savings: number } {
  const vipPrice = Math.round(basePrice * (1 - vipDiscount));
  const savings = basePrice - vipPrice;
  
  return {
    normal: basePrice,
    vip: vipPrice,
    savings: savings
  };
}
