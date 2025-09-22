// Simple Auth Service - Only Login and Register
const API_BASE_URL = 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

// Helper function to make API requests
const apiRequest = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error:", error.message || error);
    throw error;
  }
};

// MAIN FUNCTIONS - Only Login and Register

export async function UserLoginApi(data: LoginData) {
  try {
    const response = await apiRequest('/auth/login', data);
    
    if (response.success && response.data) {
      // Store token and user data based on role
      if (response.data.user.role === 'admin') {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  } catch (error) {
    console.log("Error fetching login:", error.message || error);
    throw error;
  }
}

export async function UserRegisterApi(data: RegisterData) {
  try {
    const response = await apiRequest('/auth/register', data);
    
    if (response.success && response.data) {
      // Store token and user data based on role
      if (response.data.user.role === 'admin') {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  } catch (error) {
    console.log("Error fetching register:", error.message || error);
    throw error;
  }
}


export default {
  UserLoginApi,
  UserRegisterApi,
};