/**
 * Authentication types
 */

/**
 * User object returned from API
 */
export interface User {
  id: number;
  name: string;
  first_name: string;
  last_name?: string;
  email: string;
  role: string;
  avatar: string | null;
  auth_provider: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Auth response from login/register endpoints
 */
export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  device_name?: string;
}

/**
 * Registration credentials
 */
export interface RegisterCredentials {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  password_confirmation: string;
  device_name?: string;
}

/**
 * Google OAuth credentials
 */
export interface GoogleAuthCredentials {
  id_token: string;
  device_name?: string;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  message: string;
}

/**
 * Current user response from /me endpoint
 */
export interface MeResponse {
  user: User;
}
