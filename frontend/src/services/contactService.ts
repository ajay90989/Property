import { apiPost, apiGet, apiPut } from './api';
import { PaginationParams } from './api';

// Types
export interface Contact {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    propertyId?: {
        _id: string;
        title: string;
        location: {
            address: string;
            city: string;
            state: string;
        };
    };
    type: 'general' | 'property-inquiry' | 'support' | 'feedback' | 'complaint';
    status: 'new' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    };
    response?: {
        message: string;
        respondedBy: {
            _id: string;
            name: string;
            email: string;
        };
        respondedAt: string;
    };
    source: 'website' | 'phone' | 'email' | 'social-media' | 'referral';
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContactFilters extends PaginationParams {
    status?: string;
    priority?: string;
    type?: string;
}

export interface SubmitContactData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    propertyId?: string;
    type?: 'general' | 'property-inquiry' | 'support' | 'feedback' | 'complaint';
}

export interface UpdateContactStatusData {
    status?: 'new' | 'in-progress' | 'resolved' | 'closed';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: string;
}

export interface RespondToContactData {
    message: string;
}

export interface ContactStats {
    overview: {
        total: number;
        new: number;
        inProgress: number;
        resolved: number;
        closed: number;
    };
    byType: Array<{
        _id: string;
        count: number;
    }>;
    byPriority: Array<{
        _id: string;
        count: number;
    }>;
}

// Contact Service Functions
export const contactService = {
    // Submit contact form
    async submitContact(data: SubmitContactData): Promise<{ success: boolean; data: Contact }> {
        try {
            const response = await apiPost<Contact>('/contacts', data);
            return response;
        } catch (error) {
            console.error('Submit contact error:', error);
            throw error;
        }
    },

    // Get all contacts (Admin only)
    async getContacts(filters: ContactFilters = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Contact[];
    }> {
        try {
            const response = await apiGet<Contact[]>('/contacts', filters);
            return response;
        } catch (error) {
            console.error('Get contacts error:', error);
            throw error;
        }
    },

    // Get single contact (Admin only)
    async getContact(id: string): Promise<{ success: boolean; data: Contact }> {
        try {
            const response = await apiGet<Contact>(`/contacts/${id}`);
            return response;
        } catch (error) {
            console.error('Get contact error:', error);
            throw error;
        }
    },

    // Update contact status (Admin only)
    async updateContactStatus(id: string, data: UpdateContactStatusData): Promise<{ success: boolean; data: Contact }> {
        try {
            const response = await apiPut<Contact>(`/contacts/${id}/status`, data);
            return response;
        } catch (error) {
            console.error('Update contact status error:', error);
            throw error;
        }
    },

    // Respond to contact (Admin only)
    async respondToContact(id: string, data: RespondToContactData): Promise<{ success: boolean; data: Contact }> {
        try {
            const response = await apiPost<Contact>(`/contacts/${id}/respond`, data);
            return response;
        } catch (error) {
            console.error('Respond to contact error:', error);
            throw error;
        }
    },

    // Get contact statistics (Admin only)
    async getContactStats(): Promise<{ success: boolean; data: ContactStats }> {
        try {
            const response = await apiGet<ContactStats>('/contacts/stats');
            return response;
        } catch (error) {
            console.error('Get contact stats error:', error);
            throw error;
        }
    },

    // Get contacts by status (Admin only)
    async getContactsByStatus(status: string, filters: Omit<ContactFilters, 'status'> = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Contact[];
    }> {
        try {
            const response = await apiGet<Contact[]>('/contacts', { ...filters, status });
            return response;
        } catch (error) {
            console.error('Get contacts by status error:', error);
            throw error;
        }
    },

    // Get contacts by priority (Admin only)
    async getContactsByPriority(priority: string, filters: Omit<ContactFilters, 'priority'> = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Contact[];
    }> {
        try {
            const response = await apiGet<Contact[]>('/contacts', { ...filters, priority });
            return response;
        } catch (error) {
            console.error('Get contacts by priority error:', error);
            throw error;
        }
    },

    // Get contacts by type (Admin only)
    async getContactsByType(type: string, filters: Omit<ContactFilters, 'type'> = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Contact[];
    }> {
        try {
            const response = await apiGet<Contact[]>('/contacts', { ...filters, type });
            return response;
        } catch (error) {
            console.error('Get contacts by type error:', error);
            throw error;
        }
    }
};

export default contactService;
