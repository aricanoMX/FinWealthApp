import { supabase } from './supabase.client';
import { SessionService } from './session.service';
import type { User } from '../store/auth.store';

export const AuthService = {
  /**
   * Realiza el login y persiste la sesión si es exitoso.
   */
  async signInWithEmail(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session || !data.user) {
      throw new Error('Sesión no retornada por el servidor.');
    }

    // Persistir de forma segura en SRP
    await SessionService.setToken(data.session.access_token);

    return {
      id: data.user.id,
      email: data.user.email!,
    };
  },

  /**
   * Cierra sesión y limpia el almacenamiento seguro.
   */
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    await SessionService.clearToken();
  },
};
