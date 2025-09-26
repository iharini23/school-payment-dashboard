import { apiClient } from './client';
import { TransactionsResponse } from '../types';

export type TransactionsQuery = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  statuses?: string[];
  school_id?: string;
  from_date?: string;
  to_date?: string;
};

export const fetchTransactions = (query: TransactionsQuery = {}) =>
  apiClient.get<TransactionsResponse>('/transactions', {
    params: {
      page: 1,
      limit: 10,
      sort: 'payment_time',
      order: 'desc',
      ...query,
      statuses: query.statuses?.length ? query.statuses.join(',') : undefined,
    },
  });
