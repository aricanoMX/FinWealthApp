import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from './LoginScreen';
import { AuthService } from '../../auth/auth.service';
import { useAuthStore } from '../../store/auth.store';

// Mock dependencias
jest.mock('../../auth/auth.service', () => ({
  AuthService: {
    signInWithEmail: jest.fn(),
  },
}));

describe('<LoginScreen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('renders title, inputs and button correctly', () => {
    const { getByText, getByTestId } = render(<LoginScreen />);
    
    expect(getByText('FinWealth App')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
  });

  it('shows error when fields are empty and button is pressed', () => {
    const { getByTestId, queryByTestId } = render(<LoginScreen />);
    
    // initially no error
    expect(queryByTestId('error-message')).toBeNull();

    // press login without filling inputs
    fireEvent.press(getByTestId('login-button'));

    // now error should be shown
    expect(getByTestId('error-message')).toBeTruthy();
    expect(getByTestId('error-message').props.children).toBe('Por favor completa todos los campos');
  });

  it('shows error if AuthService fails', async () => {
    const errorMessage = 'Invalid credentials';
    (AuthService.signInWithEmail as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { getByTestId, queryByTestId } = render(<LoginScreen />);
    
    // fill inputs
    fireEvent.changeText(getByTestId('email-input'), 'test@test.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');

    // press login
    fireEvent.press(getByTestId('login-button'));

    // wait for async login process
    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
      expect(getByTestId('error-message').props.children).toBe(errorMessage);
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('calls login on AuthStore if AuthService succeeds', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    (AuthService.signInWithEmail as jest.Mock).mockResolvedValueOnce(mockUser);

    const { getByTestId, queryByTestId } = render(<LoginScreen />);
    
    // fill inputs
    fireEvent.changeText(getByTestId('email-input'), 'test@test.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');

    // press login
    fireEvent.press(getByTestId('login-button'));

    // wait for async login process
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    expect(queryByTestId('error-message')).toBeNull();
  });
});
