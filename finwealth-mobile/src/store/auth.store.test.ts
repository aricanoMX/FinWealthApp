import { useAuthStore } from './auth.store';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('should initialize with no user and not authenticated', () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('should set user and authentication status on login', () => {
    const { login } = useAuthStore.getState();

    const mockUser = { id: 'user-123', email: 'test@example.com' };
    login(mockUser);

    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(isAuthenticated).toBe(true);
  });

  it('should clear user and authentication status on logout', () => {
    // First, login to set state
    const { login, logout } = useAuthStore.getState();
    login({ id: 'user-123', email: 'test@example.com' });

    // Now logout
    logout();

    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });
});
