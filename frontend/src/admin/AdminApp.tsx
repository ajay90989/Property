import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import BlogManagement from './pages/BlogManagement';
import AddBlog from './pages/AddBlog';
import EditBlog from './pages/EditBlog';
import UserManagement from './pages/UserManagement';

const AdminApp = () => {
  return (
    <Routes>
        {/* Public routes */}
        <Route path="login" element={<AdminLogin />} />
        
        {/* Protected routes */}
        <Route path="" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/add" element={<AddProperty />} />
          <Route path="properties/edit/:id" element={<EditProperty />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="blogs/add" element={<AddBlog />} />
          <Route path="blogs/edit/:id" element={<EditBlog />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-gray-600">Coming soon...</p></div>} />
          <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600">Coming soon...</p></div>} />
        </Route>
        
        {/* Redirect any other admin routes to login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminApp;
