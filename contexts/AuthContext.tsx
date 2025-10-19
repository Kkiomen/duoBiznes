import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import * as authService from '@/services/auth';
import { getToken } from '@/services/token-storage';

/**
 * Auth context state
 */
interface AuthContextState {
  // Auth data
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Loading and error states
  loading: boolean;
  error: string | null;
  initialCheckComplete: boolean;

  // Actions
  login: (credentials: Omit<LoginCredentials, 'device_name'>) => Promise<void>;
  register: (credentials: Omit<RegisterCredentials, 'device_name'>) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

/**
 * Default state
 */
const defaultState: AuthContextState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialCheckComplete: false,
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  logoutAll: async () => {},
  checkAuth: async () => {},
  clearError: () => {},
};

const AuthContext = createContext<AuthContextState>(defaultState);

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * Props for AuthProvider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth provider component
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  /**
   * Check authentication status on mount
   * Attempts to load user if token exists
   */
  const checkAuth = async () => {
    try {
      const storedToken = await getToken();
      if (!storedToken) {
        setInitialCheckComplete(true);
        return;
      }

      // Token exists - verify it and load user
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setToken(storedToken);
      setError(null);
      console.log('✅ User authenticated:', userData.email);
    } catch (err) {
      console.log('⚠️ Auth check failed:', err);
      // Token invalid or expired - clear state
      setUser(null);
      setToken(null);
      if (err instanceof Error) {
        // Don't show error for initial check - just silently fail
        console.log('Initial auth check failed - user needs to login');
      }
    } finally {
      setLoading(false);
      setInitialCheckComplete(true);
    }
  };

  /**
   * Login with email and password
   */
  const login = async (credentials: Omit<LoginCredentials, 'device_name'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      console.log('✅ Logged in:', response.user.email);
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd podczas logowania');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (credentials: Omit<RegisterCredentials, 'device_name'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(credentials);
      setUser(response.user);
      setToken(response.token);
      console.log('✅ Registered:', response.user.email);
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd podczas rejestracji');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with Google OAuth
   */
  const loginWithGoogle = async (idToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.loginWithGoogle(idToken);
      setUser(response.user);
      setToken(response.token);
      console.log('✅ Logged in with Google:', response.user.email);
    } catch (err) {
      console.error('Google login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd podczas logowania przez Google');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout from current device
   */
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      console.log('✅ Logged out');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if API call fails, we clear local state
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout from all devices
   */
  const logoutAll = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logoutAll();
      setUser(null);
      setToken(null);
      console.log('✅ Logged out from all devices');
    } catch (err) {
      console.error('Logout all error:', err);
      // Even if API call fails, we clear local state
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Check auth on mount
   */
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextState = {
    user,
    token,
    isAuthenticated: user !== null && token !== null,
    loading,
    error,
    initialCheckComplete,
    login,
    register,
    loginWithGoogle,
    logout,
    logoutAll,
    checkAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
