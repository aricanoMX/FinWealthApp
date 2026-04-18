import axios, { AxiosError } from 'axios';
import { SessionService } from '../auth/session.service';

// Definimos el contrato de la respuesta global de errores esperada del backend
export interface ApiErrorResponse {
  success: boolean;
  code: string;
  message: string;
  details?: any;
}

export class AppError extends Error {
  code: string;
  details?: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

export const apiClient = axios.create({
  // EXPO_PUBLIC_ prefix is required for Expo to bundle the env var into the client
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Interceptor de Peticiones (Inyectar Token)
apiClient.interceptors.request.use(async (config) => {
  const token = await SessionService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Si tenemos una respuesta estructurada de nuestro backend NestJS
    if (error.response && error.response.data && error.response.data.code) {
      const serverError = error.response.data;
      throw new AppError(serverError.code, serverError.message, serverError.details);
    }
    
    // Si es un error de red o no tiene el payload esperado
    throw new AppError(
      'NETWORK_ERROR',
      error.message || 'Error de conexión con el servidor.'
    );
  }
);
