import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: Location })?.from ?? { pathname: '/' };
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoginForm />
    </div>
  );
};
