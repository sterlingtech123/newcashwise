import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to redirect to login
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    // Clear any additional storage
    localStorage.removeItem('auth-storage');
    sessionStorage.clear();
    // Force redirect to login
    window.location.href = '/auth/login';
  }
};

interface User {
  id: string;
  email: string;
  name: string;
  tenantId?: string;
  roles: string[];
  permissions: string[];
  avatar?: string;
  lastLogin?: Date;
  mda?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isLoggingOut: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isLoggingOut: false,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user
      }),

      setTokens: (token, refreshToken) => set({
        token,
        refreshToken
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: (user, token, refreshToken) => set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        error: null,
        isLoading: false
      }),

      logout: () => {
        // Set logging out state to prevent redirect loops
        set({ isLoggingOut: true });
        
        // Clear all state
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
          isLoggingOut: false
        });
        
        // Clear persisted storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          sessionStorage.clear();
        }
        
        // Small delay to ensure state is cleared before redirect
        setTimeout(() => {
          redirectToLogin();
        }, 100);
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
      // Add version to handle migrations
      version: 1,
      // Add onRehydrateStorage to handle rehydration issues
      onRehydrateStorage: () => (state) => {
        // If no user or token, ensure we're not authenticated
        if (state && (!state.user || !state.token)) {
          state.isAuthenticated = false;
        }
      },
    }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
