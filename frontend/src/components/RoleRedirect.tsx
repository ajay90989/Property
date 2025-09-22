import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        // Redirect admin to admin dashboard
        navigate('/admin', { replace: true });
      } else if (isUser) {
        // Redirect user to home page
        navigate('/', { replace: true });
      }
    } else {
      // If not authenticated, redirect to home
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isAdmin, isUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default RoleRedirect;
