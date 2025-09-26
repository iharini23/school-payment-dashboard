import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { attachToken } from '../api/client';
import { useAuth } from '../hooks/useAuth';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    attachToken(token);
  }, [token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
