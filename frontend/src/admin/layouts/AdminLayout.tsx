import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Plus, 
  List, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'properties', label: 'Properties', icon: Home, path: '/admin/properties' },
    { id: 'add-property', label: 'Add Property', icon: Plus, path: '/admin/properties/add' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'media', label: 'Media', icon: ImageIcon, path: '/admin/media' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col m-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto" style={{ background: '#46a0c5', margin: 0 }}>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`w-full justify-start transition-all duration-200 rounded-lg ${
                      isActive(item.path) 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md'
                    }`}
                    style={{ marginTop: '15px' }}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0" style={{ background: '#46a0c5' }}>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-900 hover:text-red-300 transition-all duration-200 rounded-lg"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="w-[84%] ml-[228px]">
        {/* Top bar */}
        <header className="shadow-lg border-b h-16 flex items-center justify-between px-6 fixed w-full" style={{ zIndex: 999, background: 'skyblue', color: 'black' }}>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-sm">
              Admin
            </Badge>
            <div className="text-sm font-medium" style={{ color: 'black' }}>
              Welcome back, Admin
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 bg-gray-50 min-h-screen pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
