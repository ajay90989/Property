import { apiPost, apiGet, apiPut } from './api';

// Types
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    isActive: boolean;
    avatar?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
    };
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

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
    };
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

// Auth Service Functions
export const authService = {
    // Login user
    async login(data: LoginData): Promise<AuthResponse> {
        try {
            const response = await apiPost<AuthResponse>('/auth/login', data);

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
            console.error('Login error:', error);
            throw error;
        }
    },

    // Register user
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            const response = await apiPost<AuthResponse>('/auth/register', data);

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
            console.error('Register error:', error);
            throw error;
        }
    },

    // Get current user
    async getMe(): Promise<{ success: boolean; data: { user: User } }> {
        try {
            const response = await apiGet<{ user: User }>('/auth/me');
            return response;
        } catch (error) {
            console.error('Get me error:', error);
            throw error;
        }
    },

    // Update profile
    async updateProfile(data: UpdateProfileData): Promise<{ success: boolean; data: { user: User } }> {
        try {
            const response = await apiPut<{ user: User }>('/auth/profile', data);
            return response;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    // Change password
    async changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiPut<{ message: string }>('/auth/change-password', data);
            return response;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    // Logout (clear local storage)
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    },

    // Get stored user data
    getStoredUser(): User | null {
        try {
            const userData = localStorage.getItem('user') || localStorage.getItem('adminUser');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing stored user data:', error);
            return null;
        }
    },

    // Get stored token
    getStoredToken(): string | null {
        return localStorage.getItem('token') || localStorage.getItem('adminToken');
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = this.getStoredToken();
        const user = this.getStoredUser();
        return !!(token && user);
    },

    // Check if user is admin
    isAdmin(): boolean {
        const user = this.getStoredUser();
        return user?.role === 'admin';
    },

    // Check if user is regular user
    isUser(): boolean {
        const user = this.getStoredUser();
        return user?.role === 'user';
    }
};

export default authService;
