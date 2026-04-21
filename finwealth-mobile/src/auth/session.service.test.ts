import { SessionService } from './session.service';
import * as SecureStore from 'expo-secure-store';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('SessionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a token securely', async () => {
    await SessionService.setToken('my-secret-jwt');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('finwealth_auth_token', 'my-secret-jwt');
  });

  it('should retrieve a token securely', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('stored-jwt');

    const token = await SessionService.getToken();

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('finwealth_auth_token');
    expect(token).toBe('stored-jwt');
  });

  it('should delete a token securely', async () => {
    await SessionService.clearToken();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('finwealth_auth_token');
  });
});
