import axios from 'axios';
import { supabase } from './supabase';

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, unknown>;

  constructor(message: string, status: number, fieldErrors?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const body = error.response?.data as
        | { message?: string; errors?: Record<string, unknown> }
        | undefined;

      if (status === 401) {
        void supabase.auth.signOut();
      }

      throw new ApiError(body?.message ?? error.message, status, body?.errors);
    }
    throw error;
  },
);
