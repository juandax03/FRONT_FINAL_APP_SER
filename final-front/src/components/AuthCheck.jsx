import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Navigate } from 'react-router-dom';

const AuthCheck = ({ children, redirectTo = '/login' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        setIsAuthenticated(!!session.tokens);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading">Verificando autenticación...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default AuthCheck;