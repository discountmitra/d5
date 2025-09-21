import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserMode = 'normal' | 'vip';

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
}

interface VipContextType {
  userMode: UserMode;
  isVip: boolean;
  subscription: UserSubscription | null;
  setUserMode: (mode: UserMode) => void;
  toggleMode: () => void;
  subscribeToPlan: (planId: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  getSubscriptionStatus: () => {
    isActive: boolean;
    daysRemaining: number;
    planName: string;
  };
}

const VipContext = createContext<VipContextType | undefined>(undefined);

interface VipProviderProps {
  children: ReactNode;
}

// Available subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
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
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isVip, setIsVip] = useState(false);
  const [userMode, setUserMode] = useState<UserMode>('normal');

  // Set default mode based on VIP status
  useEffect(() => {
    setUserMode(isVip ? 'vip' : 'normal');
  }, [isVip]);

  // Check subscription status on mount
  useEffect(() => {
    // In a real app, this would check with the backend
    // For now, we'll use a simple in-memory approach
    // In production, this would use AsyncStorage or backend API
    try {
      // Simulate checking for existing subscription
      // This would be replaced with actual storage/API call
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  }, []);

  const toggleMode = () => {
    if (isVip) {
      setUserMode(prev => prev === 'normal' ? 'vip' : 'normal');
    }
  };

  const subscribeToPlan = async (planId: string): Promise<boolean> => {
    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) return false;

      const startDate = new Date();
      const endDate = new Date();
      
      // Set end date based on plan duration
      switch (planId) {
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'quarterly':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      const newSubscription: UserSubscription = {
        planId,
        startDate,
        endDate,
        isActive: true,
        autoRenew: true
      };

      setSubscription(newSubscription);
      setIsVip(true);
      
      // In a real app, this would be saved to backend/AsyncStorage
      // For now, we'll just update the state
      
      return true;
    } catch (error) {
      console.error('Subscription failed:', error);
      return false;
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    try {
      if (subscription) {
        const updatedSubscription = { ...subscription, isActive: false, autoRenew: false };
        setSubscription(updatedSubscription);
        setIsVip(false);
        setUserMode('normal');
        
        // In a real app, this would update backend/AsyncStorage
      }
      return true;
    } catch (error) {
      console.error('Cancellation failed:', error);
      return false;
    }
  };

  const getSubscriptionStatus = () => {
    if (!subscription || !subscription.isActive) {
      return { isActive: false, daysRemaining: 0, planName: 'No Active Plan' };
    }

    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId);
    
    return {
      isActive: daysRemaining > 0,
      daysRemaining: Math.max(0, daysRemaining),
      planName: plan?.name || 'Unknown Plan'
    };
  };

  const value: VipContextType = {
    userMode,
    isVip,
    subscription,
    setUserMode,
    toggleMode,
    subscribeToPlan,
    cancelSubscription,
    getSubscriptionStatus,
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
