import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/auth';
import { attachToken } from '../api/client';
import { AuthResponse } from '../types';

type AuthState = {
  token: string | null;
  username: string | null;
};

type AuthContextValue = {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEY = 'school-payment-auth';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { token: null, username: null };
    }

    try {
      const parsed = JSON.parse(stored) as AuthState;
      attachToken(parsed.token);
      return parsed;
    } catch (error) {
      console.error('Failed to parse auth state', error);
      return { token: null, username: null };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    attachToken(authState.token);
  }, [authState]);

  const login = useCallback(async (username: string, password: string) => {
    const response = await loginRequest({ username, password });
    const payload = response.data as AuthResponse;

    setAuthState({ token: payload.access_token, username });
    navigate('/');
  }, [navigate]);

  const logout = useCallback(() => {
    setAuthState({ token: null, username: null });
    localStorage.remove(STORAGE_KEY);
    navigate('/login');
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: authState.token,
      username: authState.username,
      isAuthenticated: Boolean(authState.token),
      login,
      logout,
    }),
    [authState.token, authState.username, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
