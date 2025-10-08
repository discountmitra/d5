import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { User, Profile, UserRole } from '../types';
import { authService } from '../services';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  profile: Profile | null;
};

type AuthContextType = {
  authState: AuthState;
  login: (phone: string, name?: string) => Promise<void>;
  loginWithEmail: (email: string, otp: string) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeProfile: (name: string) => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    profile: null,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // First check local storage for cached user data
      const cachedUser = await AsyncStorage.getItem('user');
      if (cachedUser) {
        const user = JSON.parse(cachedUser);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
          profile: null, // Will be fetched separately
        });
        
        // Try to refresh user data from backend
        try {
          const freshUser = await authService.getCurrentUser();
          if (freshUser) {
            setAuthState(prev => ({
              ...prev,
              user: freshUser,
            }));
            await AsyncStorage.setItem('user', JSON.stringify(freshUser));
          }
        } catch (error) {
          console.warn('Failed to refresh user data:', error);
          // Continue with cached data
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          profile: null,
        });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
      });
    }
  };

  const login = async (phone: string, name?: string) => {
    try {
      // For now, create a local user object
      // This will be replaced with actual API calls
      const userData: User = {
        id: `user_${Date.now()}`,
        phone,
        name,
        role: 'normal',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userData,
        profile: null,
      });
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, otp: string) => {
    try {
      const user = await authService.signInWithEmail(email, otp);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
        profile: null,
      });
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error during email login:', error);
      throw error;
    }
  };

  const sendOtp = async (email: string) => {
    try {
      await authService.sendOtp(email);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const completeProfile = async (name: string) => {
    try {
      if (!authState.user) throw new Error('No user found');
      
      const userData = { ...authState.user, name };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setAuthState(prev => ({
        ...prev,
        user: userData,
      }));
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing profile:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      const updatedProfile = await authService.updateProfile(profileData);
      setAuthState(prev => ({
        ...prev,
        profile: updatedProfile,
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      await AsyncStorage.removeItem('user');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
      });
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if API call fails
      await AsyncStorage.removeItem('user');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
      });
      router.replace('/(auth)/login');
    }
  };

  const refreshUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setAuthState(prev => ({
          ...prev,
          user,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      login, 
      loginWithEmail, 
      sendOtp, 
      logout, 
      completeProfile, 
      updateProfile,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}