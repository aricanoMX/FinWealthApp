import { create } from 'zustand';
import { AuthService } from '../auth/auth.service';

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.signInWithEmail(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Error al iniciar sesión',
        isLoading: false,
      });
    }
  },
  logout: () => set({ user: null, isAuthenticated: false, error: null }),
  setError: (error: string | null) => set({ error }),
}));
