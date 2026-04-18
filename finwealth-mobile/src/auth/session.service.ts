import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'finwealth_auth_token';

export const SessionService = {
  /**
   * Guarda de manera segura el JWT u otro token crítico.
   * Responsabilidad Única: Escritura en Secure Store.
   */
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  /**
   * Recupera de manera segura el JWT persistido.
   * Responsabilidad Única: Lectura desde Secure Store.
   */
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  /**
   * Elimina el JWT para destruir la sesión local.
   * Responsabilidad Única: Borrado en Secure Store.
   */
  async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
