import { API_ENDPOINTS, REQUEST_TIMEOUT } from '@/constants/api';
import type {
    AuthResponse,
    GoogleAuthCredentials,
    LoginCredentials,
    MeResponse,
    RegisterCredentials,
    User
} from '@/types/auth';
import { Platform } from 'react-native';
import { ApiError } from './api';
import { getToken, removeToken, saveToken } from './token-storage';

/**
 * Get device name for token identification
 */
function getDeviceName(): string {
  if (Platform.OS === 'ios') {
    return 'iPhone';
  } else if (Platform.OS === 'android') {
    return 'Android';
  } else if (Platform.OS === 'web') {
    return 'Web Browser';
  }
  return 'Unknown Device';
}

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if ((error as Error).name === 'AbortError') {
      throw new ApiError('Przekroczono czas oczekiwania na odpowiedź serwera');
    }
    throw error;
  }
}

/**
 * Register a new user
 */
export async function register(credentials: Omit<RegisterCredentials, 'device_name'>): Promise<AuthResponse> {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.register(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...credentials,
        device_name: getDeviceName(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 422) {
        // Validation errors
        const errors = errorData.errors || {};
        const errorMessages = Object.values(errors).flat().join(', ');
        throw new ApiError(errorMessages || 'Błędne dane rejestracji', response.status);
      }

      throw new ApiError(
        errorData.message || `Błąd rejestracji: ${response.statusText}`,
        response.status
      );
    }

    const responseData = await response.json();

    // API returns { success, message, data: { user, token } }
    const data: AuthResponse = responseData.data || responseData;

    // Save token to secure storage
    await saveToken(data.token);

    console.log('✅ Rejestracja zakończona pomyślnie');
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if ((error as Error).message.includes('Network request failed')) {
      throw new ApiError('Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.');
    }

    throw new ApiError('Wystąpił nieoczekiwany błąd podczas rejestracji', undefined, error);
  }
}

/**
 * Login user with email and password
 */
export async function login(credentials: Omit<LoginCredentials, 'device_name'>): Promise<AuthResponse> {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.login(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...credentials,
        device_name: getDeviceName(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new ApiError('Nieprawidłowy email lub hasło', response.status);
      }

      if (response.status === 422) {
        // Validation errors
        const errors = errorData.errors || {};
        const errorMessages = Object.values(errors).flat().join(', ');
        throw new ApiError(errorMessages || 'Błędne dane logowania', response.status);
      }

      throw new ApiError(
        errorData.message || `Błąd logowania: ${response.statusText}`,
        response.status
      );
    }

    const responseData = await response.json();

    // API returns { success, message, data: { user, token } }
    const data: AuthResponse = responseData.data || responseData;

    // Save token to secure storage
    await saveToken(data.token);

    console.log('✅ Logowanie zakończone pomyślnie');
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if ((error as Error).message.includes('Network request failed')) {
      throw new ApiError('Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.');
    }

    throw new ApiError('Wystąpił nieoczekiwany błąd podczas logowania', undefined, error);
  }
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  try {
    const credentials: GoogleAuthCredentials = {
      id_token: idToken,
      device_name: getDeviceName(),
    };

    const response = await fetchWithTimeout(API_ENDPOINTS.googleAuth(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new ApiError('Nieprawidłowy token Google', response.status);
      }

      throw new ApiError(
        errorData.message || `Błąd logowania przez Google: ${response.statusText}`,
        response.status
      );
    }

    const responseData = await response.json();

    // API returns { success, message, data: { user, token } }
    const data: AuthResponse = responseData.data || responseData;

    // Save token to secure storage
    await saveToken(data.token);

    console.log('✅ Logowanie przez Google zakończone pomyślnie');
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if ((error as Error).message.includes('Network request failed')) {
      throw new ApiError('Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.');
    }

    throw new ApiError('Wystąpił nieoczekiwany błąd podczas logowania przez Google', undefined, error);
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const token = await getToken();
    if (!token) {
      throw new ApiError('Brak tokenu autoryzacji', 401);
    }

    const response = await fetchWithTimeout(API_ENDPOINTS.me(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - remove it
        await removeToken();
        throw new ApiError('Sesja wygasła. Zaloguj się ponownie.', response.status);
      }

      throw new ApiError(
        `Błąd pobierania danych użytkownika: ${response.statusText}`,
        response.status
      );
    }

    const responseData = await response.json();
    
    // API may return { success, data: { user } } or { user }
    const data: MeResponse = responseData.data || responseData;
    return data.user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if ((error as Error).message.includes('Network request failed')) {
      throw new ApiError('Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.');
    }

    throw new ApiError('Wystąpił nieoczekiwany błąd podczas pobierania danych użytkownika', undefined, error);
  }
}

/**
 * Logout from current device
 */
export async function logout(): Promise<void> {
  try {
    const token = await getToken();
    if (!token) {
      // Already logged out
      return;
    }

    const response = await fetchWithTimeout(API_ENDPOINTS.logout(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    // Remove token regardless of API response
    await removeToken();

    if (!response.ok) {
      console.warn('Logout API call failed, but token was removed locally');
      return;
    }

    console.log('✅ Wylogowano pomyślnie');
  } catch (error) {
    // Always remove token even if API call fails
    await removeToken();
    console.warn('Logout error (token removed locally):', error);
  }
}

/**
 * Logout from all devices
 */
export async function logoutAll(): Promise<void> {
  try {
    const token = await getToken();
    if (!token) {
      // Already logged out
      return;
    }

    const response = await fetchWithTimeout(API_ENDPOINTS.logoutAll(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    // Remove token regardless of API response
    await removeToken();

    if (!response.ok) {
      console.warn('Logout-all API call failed, but token was removed locally');
      return;
    }

    console.log('✅ Wylogowano ze wszystkich urządzeń');
  } catch (error) {
    // Always remove token even if API call fails
    await removeToken();
    console.warn('Logout-all error (token removed locally):', error);
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}
