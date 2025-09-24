import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored authentication data
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else if (adminToken && adminUser) {
      try {
        const adminData = JSON.parse(adminUser);
        setUser(adminData);
        setToken(adminToken);
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    
    // Store in localStorage based on role
    if (userData.role === 'admin') {
      localStorage.setItem('adminToken', userToken);
      localStorage.setItem('adminUser', JSON.stringify(userData));
    } else {
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
