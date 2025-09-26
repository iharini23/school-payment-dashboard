import { apiClient } from './client';
import { PaymentCreatePayload, PaymentCreateResponse } from '../types';

export const createPayment = (payload: PaymentCreatePayload) =>
  apiClient.post<PaymentCreateResponse>('/payment', payload);

export const fetchTransactionStatus = (customOrderId: string) =>
  apiClient.get(`/transactions/${encodeURIComponent(customOrderId)}`);
