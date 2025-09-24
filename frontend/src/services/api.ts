// Base API Configuration
import { API_BASE_URL as BASE_URL } from '../config/api';

const API_BASE_URL = `${BASE_URL}/api`;

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    count?: number;
    total?: number;
    page?: number;
    pages?: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Request configuration
interface RequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    requiresAuth?: boolean;
}

// Get auth token based on user role
const getAuthToken = (): string | null => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    return adminToken || userToken;
};

// Base API request function
export async function apiRequest<T = any>(
    endpoint: string,
    config: RequestConfig = { method: 'GET' }
): Promise<ApiResponse<T>> {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = getAuthToken();

        const requestConfig: RequestInit = {
            method: config.method,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...config.headers,
            },
        };

        if (config.body && config.method !== 'GET') {
            requestConfig.body = JSON.stringify(config.body);
        }

        const response = await fetch(url, requestConfig);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            url: url,
            method: config.method
        });
        throw error;
    }
}

// GET request helper
export function apiGet<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const fullUrl = `${endpoint}${queryString}`;
    return apiRequest<T>(fullUrl, { method: 'GET' });
}

// POST request helper
export function apiPost<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'POST', body: data });
}

// PUT request helper
export function apiPut<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'PUT', body: data });
}

// DELETE request helper
export function apiDelete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// PATCH request helper
export function apiPatch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { method: 'PATCH', body: data });
}

// File upload helper
export async function apiUpload<T = any>(
    endpoint: string,
    formData: FormData,
    method: 'POST' | 'PUT' = 'POST'
): Promise<ApiResponse<T>> {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = getAuthToken();

        const response = await fetch(url, {
            method: method,
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Upload Error:', error);
        throw error;
    }
}

export default {
    apiRequest,
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    apiPatch,
    apiUpload,
};
