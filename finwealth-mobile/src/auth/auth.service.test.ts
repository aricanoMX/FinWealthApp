import { AuthService } from './auth.service';
import { supabase } from './supabase.client';
import { SessionService } from './session.service';

// Mock dependencias externas
jest.mock('./supabase.client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

jest.mock('./session.service', () => ({
  SessionService: {
    setToken: jest.fn(),
    clearToken: jest.fn(),
  },
}));

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signInWithEmail', () => {
    it('should throw an error if supabase returns an error', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Invalid credentials' },
      });

      await expect(AuthService.signInWithEmail('test@test.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      );
      expect(SessionService.setToken).not.toHaveBeenCalled();
    });

    it('should throw an error if no session is returned', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: null, user: { id: '1', email: 'test@test.com' } },
        error: null,
      });

      await expect(AuthService.signInWithEmail('test@test.com', 'password')).rejects.toThrow(
        'Sesión no retornada por el servidor.'
      );
    });

    it('should return a User and save token on success', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: {
          session: { access_token: 'valid-jwt' },
          user: { id: 'user-123', email: 'test@test.com' },
        },
        error: null,
      });

      const user = await AuthService.signInWithEmail('test@test.com', 'password');

      expect(SessionService.setToken).toHaveBeenCalledWith('valid-jwt');
      expect(user).toEqual({ id: 'user-123', email: 'test@test.com' });
    });
  });

  describe('signOut', () => {
    it('should call supabase signout and clear token', async () => {
      await AuthService.signOut();
      
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(SessionService.clearToken).toHaveBeenCalled();
    });
  });
});
