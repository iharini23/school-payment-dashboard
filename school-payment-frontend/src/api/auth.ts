import { apiClient } from './client';
import { LoginPayload, AuthResponse } from '../types';

export const login = (payload: LoginPayload) =>
  apiClient.post<AuthResponse>('/auth/login', payload);
