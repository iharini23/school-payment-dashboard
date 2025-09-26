import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL,
  withCredentials: false,
});

export const attachToken = (token: string | null) => {
  if (!token) {
    delete apiClient.defaults.headers.common.Authorization;
    return;
  }

  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};
