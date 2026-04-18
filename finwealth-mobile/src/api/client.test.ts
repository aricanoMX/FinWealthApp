import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { apiClient, AppError } from './client';
import { SessionService } from '../auth/session.service';

// Mock SessionService
jest.mock('../auth/session.service', () => ({
  SessionService: {
    getToken: jest.fn(),
  },
}));

// Mock axios instance to test the interceptor
jest.mock('axios', () => {
  const mAxiosInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

describe('API Client Interceptor', () => {
  it('should be defined', () => {
    expect(apiClient).toBeDefined();
  });

  it('should attach Authorization header if token exists', async () => {
    const mockAxios = require('axios').create();
    const requestHandler = mockAxios.interceptors.request.use.mock.calls[0][0];
    
    (SessionService.getToken as jest.Mock).mockResolvedValue('test-token');

    const config: InternalAxiosRequestConfig = { headers: {} } as any;
    const modifiedConfig = await requestHandler(config);

    expect(SessionService.getToken).toHaveBeenCalled();
    expect(modifiedConfig.headers.Authorization).toBe('Bearer test-token');
  });

  it('should intercept API errors and throw standardized exceptions', () => {
    // Get the registered response interceptor (the rejected handler)
    const mockAxios = require('axios').create();
    const errorHandler = mockAxios.interceptors.response.use.mock.calls[0][1];

    // Simulate an error from our backend matching the global contract
    const mockError: Partial<AxiosError> = {
      isAxiosError: true,
      response: {
        data: {
          success: false,
          code: 'ERR_DOUBLE_ENTRY_VIOLATION',
          message: 'The sum is not zero.',
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      } as AxiosResponse,
    };

    // The interceptor should extract our backend's custom error and throw it
    try {
      errorHandler(mockError);
      fail('It should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      const appError = error as AppError;
      expect(appError.code).toBe('ERR_DOUBLE_ENTRY_VIOLATION');
      expect(appError.message).toBe('The sum is not zero.');
    }
  });

  it('should handle generic network errors gracefully', () => {
    const mockAxios = require('axios').create();
    const errorHandler = mockAxios.interceptors.response.use.mock.calls[0][1];

    // Simulate a network error with no response payload
    const mockError: Partial<AxiosError> = {
      isAxiosError: true,
      message: 'Network Error',
    };

    try {
      errorHandler(mockError);
      fail('It should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      const appError = error as AppError;
      expect(appError.code).toBe('NETWORK_ERROR');
      expect(appError.message).toBe('Network Error');
    }
  });
});
