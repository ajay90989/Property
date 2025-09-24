import { apiGet } from './api';
import { propertyService } from './propertyService';
import { blogService } from './blogService';
import { contactService } from './contactService';
import { analyticsService } from './analyticsService';
import { agentService } from './agentService';

// Types
export interface DashboardStats {
    totalProperties: number;
    activeProperties: number;
    totalUsers: number;
    totalContacts: number;
    totalBlogs: number;
    recentProperties: any[];
    monthlyRevenue: number;
}

export interface AdminDashboardData {
    overview: {
        totalProperties: number;
        activeProperties: number;
        totalUsers: number;
        totalContacts: number;
        totalBlogs: number;
    };
    analytics: Array<{
        _id: string;
        count: number;
    }>;
    pageViews: Array<{
        _id: {
            year: number;
            month: number;
            day: number;
        };
        count: number;
    }>;
    propertyViews: Array<{
        propertyId: string;
        title: string;
        views: number;
    }>;
    userRegistrations: Array<{
        _id: {
            year: number;
            month: number;
            day: number;
        };
        count: number;
    }>;
    deviceStats: Array<{
        _id: string;
        count: number;
    }>;
    locationStats: Array<{
        _id: string;
        count: number;
    }>;
}

// Admin Service Functions
export const adminService = {
    // Get dashboard data
    async getDashboardData(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<{ success: boolean; data: AdminDashboardData }> {
        try {
            const response = await analyticsService.getDashboardAnalytics(period);
            return response;
        } catch (error) {
            console.error('Get dashboard data error:', error);
            throw error;
        }
    },

    // Get properties for admin
    async getProperties(filters: any = {}): Promise<any> {
        try {
            const response = await propertyService.getProperties(filters);
            return response;
        } catch (error) {
            console.error('Get properties error:', error);
            throw error;
        }
    },

    // Create property
    async createProperty(data: any, images?: File[]): Promise<any> {
        try {
            const response = await propertyService.createProperty(data, images);
            return response;
        } catch (error) {
            console.error('Create property error:', error);
            throw error;
        }
    },

    // Update property
    async getProperty(id: string): Promise<any> {
        try {
            const response = await propertyService.getProperty(id);
            return response;
        } catch (error) {
            console.error('Get property error:', error);
            throw error;
        }
    },

    async updateProperty(id: string, data: any, images?: File[]): Promise<any> {
        try {
            const response = await propertyService.updateProperty(id, data, images);
            return response;
        } catch (error) {
            console.error('Update property error:', error);
            throw error;
        }
    },

    // Delete property
    async deleteProperty(id: string): Promise<any> {
        try {
            const response = await propertyService.deleteProperty(id);
            return response;
        } catch (error) {
            console.error('Delete property error:', error);
            throw error;
        }
    },

    // Toggle property status
    async togglePropertyStatus(id: string): Promise<any> {
        try {
            const response = await propertyService.togglePropertyStatus(id);
            return response;
        } catch (error) {
            console.error('Toggle property status error:', error);
            throw error;
        }
    },

    // Get blogs for admin
    async getBlogs(filters: any = {}): Promise<any> {
        try {
            const response = await blogService.getBlogs(filters);
            return response;
        } catch (error) {
            console.error('Get blogs error:', error);
            throw error;
        }
    },

    // Get single blog
    async getBlog(id: string): Promise<any> {
        try {
            const response = await blogService.getBlog(id);
            return response;
        } catch (error) {
            console.error('Get blog error:', error);
            throw error;
        }
    },

    // Create blog
    async createBlog(data: any, featuredImage?: File): Promise<any> {
        try {
            const response = await blogService.createBlog(data, featuredImage);
            return response;
        } catch (error) {
            console.error('Create blog error:', error);
            throw error;
        }
    },

    // Update blog
    async updateBlog(id: string, data: any, featuredImage?: File): Promise<any> {
        try {
            const response = await blogService.updateBlog(id, data, featuredImage);
            return response;
        } catch (error) {
            console.error('Update blog error:', error);
            throw error;
        }
    },

    // Delete blog
    async deleteBlog(id: string): Promise<any> {
        try {
            const response = await blogService.deleteBlog(id);
            return response;
        } catch (error) {
            console.error('Delete blog error:', error);
            throw error;
        }
    },

    // Toggle blog status
    async toggleBlogStatus(id: string): Promise<any> {
        try {
            const response = await blogService.toggleBlogStatus(id);
            return response;
        } catch (error) {
            console.error('Toggle blog status error:', error);
            throw error;
        }
    },

    // Get contacts for admin
    async getContacts(filters: any = {}): Promise<any> {
        try {
            const response = await contactService.getContacts(filters);
            return response;
        } catch (error) {
            console.error('Get contacts error:', error);
            throw error;
        }
    },

    // Get contact
    async getContact(id: string): Promise<any> {
        try {
            const response = await contactService.getContact(id);
            return response;
        } catch (error) {
            console.error('Get contact error:', error);
            throw error;
        }
    },

    // Update contact status
    async updateContactStatus(id: string, data: any): Promise<any> {
        try {
            const response = await contactService.updateContactStatus(id, data);
            return response;
        } catch (error) {
            console.error('Update contact status error:', error);
            throw error;
        }
    },

    // Respond to contact
    async respondToContact(id: string, data: any): Promise<any> {
        try {
            const response = await contactService.respondToContact(id, data);
            return response;
        } catch (error) {
            console.error('Respond to contact error:', error);
            throw error;
        }
    },

    // Get contact statistics
    async getContactStats(): Promise<any> {
        try {
            const response = await contactService.getContactStats();
            return response;
        } catch (error) {
            console.error('Get contact stats error:', error);
            throw error;
        }
    },

    // Get agents for admin
    async getAgents(filters: any = {}): Promise<any> {
        try {
            const response = await agentService.getAgents(filters);
            return response;
        } catch (error) {
            console.error('Get agents error:', error);
            throw error;
        }
    },

    // Create agent
    async createAgent(data: any, profileImage?: File, coverImage?: File): Promise<any> {
        try {
            const response = await agentService.createAgent(data, profileImage, coverImage);
            return response;
        } catch (error) {
            console.error('Create agent error:', error);
            throw error;
        }
    },

    // Update agent
    async updateAgent(id: string, data: any, profileImage?: File, coverImage?: File): Promise<any> {
        try {
            const response = await agentService.updateAgent(id, data, profileImage, coverImage);
            return response;
        } catch (error) {
            console.error('Update agent error:', error);
            throw error;
        }
    },

    // Delete agent
    async deleteAgent(id: string): Promise<any> {
        try {
            const response = await agentService.deleteAgent(id);
            return response;
        } catch (error) {
            console.error('Delete agent error:', error);
            throw error;
        }
    },

    // Get analytics
    async getAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<any> {
        try {
            const response = await analyticsService.getDashboardAnalytics(period);
            return response;
        } catch (error) {
            console.error('Get analytics error:', error);
            throw error;
        }
    },

    // Get property analytics
    async getPropertyAnalytics(propertyId?: string, period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<any> {
        try {
            const response = await analyticsService.getPropertyAnalytics(propertyId, period);
            return response;
        } catch (error) {
            console.error('Get property analytics error:', error);
            throw error;
        }
    },

    // Get user analytics
    async getUserAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<any> {
        try {
            const response = await analyticsService.getUserAnalytics(period);
            return response;
        } catch (error) {
            console.error('Get user analytics error:', error);
            throw error;
        }
    },

    // Track events
    async trackEvent(data: any): Promise<void> {
        try {
            await analyticsService.trackEvent(data);
        } catch (error) {
            console.error('Track event error:', error);
            // Don't throw error for analytics tracking
        }
    },

    // Get users for admin
    async getUsers(filters: any = {}): Promise<any> {
        try {
            const response = await apiGet('/users', filters);
            return response;
        } catch (error) {
            console.error('Get users error:', error);
            throw error;
        }
    },

    // Get single user
    async getUser(id: string): Promise<any> {
        try {
            const response = await apiGet(`/users/${id}`);
            return response;
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    },

    // Update user
    async updateUser(id: string, data: any): Promise<any> {
        try {
            const response = await apiPut(`/users/${id}`, data);
            return response;
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    },

    // Delete user
    async deleteUser(id: string): Promise<any> {
        try {
            const response = await apiDelete(`/users/${id}`);
            return response;
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        }
    },

    // Toggle user status
    async toggleUserStatus(id: string): Promise<any> {
        try {
            const response = await apiPatch(`/users/${id}/toggle`);
            return response;
        } catch (error) {
            console.error('Toggle user status error:', error);
            throw error;
        }
    }
};

export default adminService;
