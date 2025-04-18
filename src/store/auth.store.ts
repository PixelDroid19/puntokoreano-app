// src/store/auth.store.ts
import ENDPOINTS from "@/api";
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Mejora de interfaces con tipos más específicos
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  lastLogin?: Date;
  phone?: string;
  document_type?: string;
  document_number?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    theme?: 'light' | 'dark'; // Agregado para soporte de temas
    language?: string; // Soporte multiidioma
  };
  verified?: boolean;
  isDevelopment?: boolean; // Para distinguir entorno de desarrollo
}

// Interfaz para el estado de autenticación mejorada
interface AuthState {
  // Estado base
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokenExpiry: number | null;
  loginAttempts?: number; // Control de intentos de login

  // Acciones de autenticación mejoradas
  login: (user: User, token: string, expiresAt?: number) => void;
  logout: () => Promise<void>; // Convertido a async para manejar limpieza
  updateUser: (userData: Partial<User>) => void;
  checkTokenExpiration: () => boolean;
  refreshSession: () => Promise<void>;

  // Acciones de gestión de estado
  setTokenExpiry: (expiry: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updatePreferences: (preferences: Partial<User["preferences"]>) => void;
  updateToken: (token: string) => void;
}

// Estado inicial mejorado
const initialState: Partial<AuthState> = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tokenExpiry: null,
  loginAttempts: 0,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState as AuthState,

      login: async (user: User, token: string, expiresAt?: number) => {
        try {
          // Configurar axios con el nuevo token
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
            tokenExpiry: expiresAt || null,
            loginAttempts: 0, // Reset intentos al login exitoso
          });
        } catch (error) {
          set(state => ({
            ...state,
            loginAttempts: (state.loginAttempts || 0) + 1,
            error: "Error en inicio de sesión"
          }));
        }
      },

      logout: async () => {
        try {
          const token = get().token;
          if (token) {
            // Intentar logout en el servidor
            await axios.post(ENDPOINTS.AUTH.LOGOUT.url);
          }
        } catch (error) {
          console.error("Error during logout:", error);
        } finally {
          // Limpiar headers y estado
          delete axios.defaults.headers.common["Authorization"];
          set(initialState as AuthState);
        }
      },

      refreshSession: async () => {
        try {
          set({ isLoading: true });
          const response = await axios.post(ENDPOINTS.AUTH.CHECK_SESSION.url);
          const { token, expiresAt } = response.data;

          if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            set({ 
              token, 
              tokenExpiry: expiresAt,
              error: null 
            });
          } else {
            throw new Error("No token received");
          }
        } catch (error) {
          await get().logout();
        } finally {
          set({ isLoading: false });
        }
      },

      checkTokenExpiration: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return true;
        return Date.now() >= tokenExpiry;
      },

      updateUser: (userData: Partial<User>) => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      setTokenExpiry: (expiry: number) => {
        set({ tokenExpiry: expiry });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      updatePreferences: (preferences: Partial<User["preferences"]>) => {
        set(state => ({
          user: state.user ? {
            ...state.user,
            preferences: {
              ...state.user.preferences,
              ...preferences,
            },
          } : null,
        }));
      },

      updateToken: (token: string) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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

// Selectores mejorados
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectToken = (state: AuthState) => state.token;
export const selectIsAdmin = (state: AuthState) => state.user?.role === "admin";
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;