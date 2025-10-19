import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secure token storage
 *
 * IMPORTANT: 
 * - On iOS/Android: Uses expo-secure-store (Keychain/EncryptedSharedPreferences)
 * - On Web: Uses localStorage (since SecureStore is not available on web)
 *
 * DO NOT use AsyncStorage for tokens - it's not encrypted!
 */

const TOKEN_KEY = 'auth_token';

/**
 * Check if SecureStore is available (iOS/Android only)
 */
function isSecureStoreAvailable(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * Saves auth token securely
 */
export async function saveToken(token: string): Promise<void> {
  try {
    if (isSecureStoreAvailable()) {
      // Use SecureStore on native platforms
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      console.log('🔐 Token saved securely (SecureStore)');
    } else {
      // Use localStorage on web
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(TOKEN_KEY, token);
        console.log('🔐 Token saved (localStorage - web)');
      } else {
        throw new Error('Storage not available');
      }
    }
  } catch (error) {
    console.error('Error saving token:', error);
    throw new Error('Failed to save authentication token');
  }
}

/**
 * Retrieves auth token from secure storage
 */
export async function getToken(): Promise<string | null> {
  try {
    if (isSecureStoreAvailable()) {
      // Use SecureStore on native platforms
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        console.log('🔐 Token retrieved from secure storage');
      } else {
        console.log('🔓 No token found in storage');
      }
      return token;
    } else {
      // Use localStorage on web
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = window.localStorage.getItem(TOKEN_KEY);
        if (token) {
          console.log('🔐 Token retrieved (localStorage - web)');
        } else {
          console.log('🔓 No token found in storage');
        }
        return token;
      }
      return null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

/**
 * Removes auth token from secure storage
 */
export async function removeToken(): Promise<void> {
  try {
    if (isSecureStoreAvailable()) {
      // Use SecureStore on native platforms
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      console.log('🔓 Token removed from secure storage');
    } else {
      // Use localStorage on web
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(TOKEN_KEY);
        console.log('🔓 Token removed (localStorage - web)');
      }
    }
  } catch (error) {
    console.error('Error removing token:', error);
    throw new Error('Failed to remove authentication token');
  }
}

/**
 * Checks if a token exists in secure storage
 */
export async function hasToken(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}
