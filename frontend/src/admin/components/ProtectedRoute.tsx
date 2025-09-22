import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  console.log('ProtectedRoute check:', { adminToken: !!adminToken, adminUser: !!adminUser });

  if (!adminToken || !adminUser) {
    console.log('No admin token or user, redirecting to login');
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(adminUser);
    console.log('Admin user data:', user);
    if (user.role !== 'admin') {
      console.log('User is not admin, redirecting to login');
      return <Navigate to="/admin/login" replace />;
    }
    console.log('Admin access granted');
  } catch (error) {
    console.log('Error parsing admin user:', error);
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
