import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';

const AdminApp = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/add" element={<AddProperty />} />
          <Route path="properties/edit/:id" element={<AddProperty />} />
          <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1><p className="text-gray-600">Coming soon...</p></div>} />
          <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-gray-600">Coming soon...</p></div>} />
          <Route path="media" element={<div className="p-6"><h1 className="text-2xl font-bold">Media Library</h1><p className="text-gray-600">Coming soon...</p></div>} />
          <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600">Coming soon...</p></div>} />
        </Route>
        
        {/* Redirect any other admin routes to login */}
        <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AdminApp;
