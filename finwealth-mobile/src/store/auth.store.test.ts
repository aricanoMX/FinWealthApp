import { useAuthStore } from './auth.store';
import { AuthService } from '../auth/auth.service';

// Mock AuthService
jest.mock('../auth/auth.service', () => ({
  AuthService: {
    signInWithEmail: jest.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { user, isAuthenticated, isLoading, error } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });

  it('should set user and authentication status on successful login', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    (AuthService.signInWithEmail as jest.Mock).mockResolvedValueOnce(mockUser);

    await useAuthStore.getState().login('test@example.com', 'password123');

    const { user, isAuthenticated, isLoading, error } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(isAuthenticated).toBe(true);
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
    expect(AuthService.signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should set error on failed login', async () => {
    const errorMessage = 'Invalid credentials';
    (AuthService.signInWithEmail as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await useAuthStore.getState().login('test@example.com', 'wrong-password');

    const { user, isAuthenticated, isLoading, error } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
    expect(isLoading).toBe(false);
    expect(error).toBe(errorMessage);
  });

  it('should clear everything on logout', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@test.com' },
      isAuthenticated: true,
      error: 'some error',
    });

    useAuthStore.getState().logout();

    const { user, isAuthenticated, error } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
    expect(error).toBeNull();
  });

  it('should allow setting error manually', () => {
    const { setError } = useAuthStore.getState();
    setError('Manual error');
    expect(useAuthStore.getState().error).toBe('Manual error');
  });
});
