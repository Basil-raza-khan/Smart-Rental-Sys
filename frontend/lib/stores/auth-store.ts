import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isInitialized: false,
      isAuthenticated: false,
      login: (user: User, token: string) => {
        localStorage.setItem('token', token);
        set({ user, token, isLoading: false, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isLoading: false, isAuthenticated: false });
      },
      initialize: async () => {
        let token = get().token;
        if (!token || token === 'undefined') {
          token = localStorage.getItem('token');
        }
        if (token && token !== 'undefined') {
          localStorage.setItem('token', token);
          try {
            set({ isLoading: true });
            // Import axios dynamically to avoid circular imports
            const { default: axios } = await import('axios');

            const response = await axios.get('http://localhost:5000/api/v1/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            set({
              user: response.data.data.user,
              isLoading: false,
              isInitialized: true,
              isAuthenticated: true
            });
          } catch (error) {
            console.error('Auth initialization failed:', error);
            // Keep the stored user and token, and authenticated status
            set({
              isLoading: false,
              isInitialized: true,
              isAuthenticated: true
            });
          }
        } else {
          // No valid token available
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isLoading: false,
            isInitialized: true,
            isAuthenticated: false
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);