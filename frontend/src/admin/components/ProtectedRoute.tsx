import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');


  if (!adminToken || !adminUser) {
    // Redirect to login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(adminUser);
    if (user.role !== 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
