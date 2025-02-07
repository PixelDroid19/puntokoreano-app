// src/store/auth.store.ts
import ENDPOINTS from "@/api";
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  lastLogin?: Date;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
  };
  verified?: boolean;
}

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokenExpiry: number | null;

  // Acciones básicas
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkTokenExpiration: () => boolean;
  refreshSession: () => Promise<void>;

  // Acciones adicionales
  setTokenExpiry: (expiry: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updatePreferences: (preferences: Partial<User["preferences"]>) => void;
  updateToken: (token: string) => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  setLoading: () => {},
  setError: () => {},
  clearError: () => {},
  updatePreferences: () => {},
  updateToken: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (user: Record<string, any>, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },

      tokenExpiry: null,

      setTokenExpiry: (expiry: number) => {
        set({ tokenExpiry: expiry });
      },

      checkTokenExpiration: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return false;
        return Date.now() >= tokenExpiry;
      },

      refreshSession: async () => {
        try {
          const response = await axios.post(ENDPOINTS.AUTH.CHECK_SESSION.url);
          const { token, expiresAt } = response.data;
          set({ token, tokenExpiry: expiresAt });
        } catch {
          get().logout();
        }
      },

      logout: () => {
        set(initialState);
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      updatePreferences: (preferences: Partial<User["preferences"]>) => {
        set((state: AuthState) => ({
          ...state,
          user: state.user
            ? {
                ...state.user,
                preferences: {
                  ...state.user.preferences,
                  ...preferences,
                },
              }
            : null,
        }));
      },

      updateToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        tokenExpiry: state.tokenExpiry,
      }),
    }
  )
);

// Selectores útiles
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
export const selectToken = (state: AuthState) => state.token;
export const selectIsAdmin = (state: AuthState) => state.user?.role === "admin";
