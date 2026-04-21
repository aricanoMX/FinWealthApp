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

// Ensure the baseURL ends with /api/v1 to match our backend versioning
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const BASE_URL = `${API_URL}/api/v1`;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for potentially heavier reports
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
    // Si tenemos una respuesta estructurada de nuestro backend NestJS (nuestro Error Filter)
    if (error.response?.data?.code) {
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
