import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from './api';
import { PaginationParams } from './api';

// Types
export interface Agent {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        avatar?: string;
    };
    bio?: string;
    specialties: ('residential' | 'commercial' | 'luxury' | 'investment' | 'rental' | 'first-time-buyers')[];
    experience: {
        years: number;
        description?: string;
    };
    languages: string[];
    certifications: Array<{
        name: string;
        issuer: string;
        date: string;
        expiryDate?: string;
    }>;
    socialMedia: {
        linkedin?: string;
        facebook?: string;
        instagram?: string;
        twitter?: string;
        website?: string;
    };
    contactInfo: {
        officePhone?: string;
        mobilePhone?: string;
        email?: string;
        officeAddress: {
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
            country?: string;
        };
    };
    workingHours: {
        monday: { start: string; end: string; isWorking: boolean };
        tuesday: { start: string; end: string; isWorking: boolean };
        wednesday: { start: string; end: string; isWorking: boolean };
        thursday: { start: string; end: string; isWorking: boolean };
        friday: { start: string; end: string; isWorking: boolean };
        saturday: { start: string; end: string; isWorking: boolean };
        sunday: { start: string; end: string; isWorking: boolean };
    };
    rating: {
        average: number;
        count: number;
    };
    propertiesSold: number;
    propertiesRented: number;
    totalValueSold: number;
    isActive: boolean;
    isFeatured: boolean;
    profileImage?: {
        url: string;
        alt: string;
    };
    coverImage?: {
        url: string;
        alt: string;
    };
    testimonials: Array<{
        _id: string;
        clientName: string;
        clientEmail: string;
        rating: number;
        comment: string;
        propertyId?: string;
        isVerified: boolean;
        createdAt: string;
    }>;
    achievements: Array<{
        _id: string;
        title: string;
        description: string;
        year: number;
        organization: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface AgentFilters extends PaginationParams {
    specialty?: string;
    city?: string;
    minRating?: number;
    search?: string;
}

export interface CreateAgentData {
    userId: string;
    bio?: string;
    specialties: string[];
    experience: {
        years: number;
        description?: string;
    };
    languages?: string[];
    certifications?: Array<{
        name: string;
        issuer: string;
        date: string;
        expiryDate?: string;
    }>;
    socialMedia?: {
        linkedin?: string;
        facebook?: string;
        instagram?: string;
        twitter?: string;
        website?: string;
    };
    contactInfo: {
        officePhone?: string;
        mobilePhone?: string;
        email?: string;
        officeAddress: {
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
            country?: string;
        };
    };
    workingHours?: {
        monday: { start: string; end: string; isWorking: boolean };
        tuesday: { start: string; end: string; isWorking: boolean };
        wednesday: { start: string; end: string; isWorking: boolean };
        thursday: { start: string; end: string; isWorking: boolean };
        friday: { start: string; end: string; isWorking: boolean };
        saturday: { start: string; end: string; isWorking: boolean };
        sunday: { start: string; end: string; isWorking: boolean };
    };
    achievements?: Array<{
        title: string;
        description: string;
        year: number;
        organization: string;
    }>;
}

export interface UpdateAgentData extends Partial<CreateAgentData> { }

export interface AddTestimonialData {
    clientName: string;
    clientEmail: string;
    rating: number;
    comment: string;
    propertyId?: string;
}

export interface AgentStats {
    rating: {
        average: number;
        count: number;
    };
    propertiesSold: number;
    propertiesRented: number;
    totalValueSold: number;
    totalProperties: number;
    propertiesByStatus: Array<{
        _id: string;
        count: number;
    }>;
}

// Agent Service Functions
export const agentService = {
    // Get all agents with filters
    async getAgents(filters: AgentFilters = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Agent[];
    }> {
        try {
            const response = await apiGet<Agent[]>('/agents', filters);
            return response;
        } catch (error) {
            console.error('Get agents error:', error);
            throw error;
        }
    },

    // Get single agent by ID
    async getAgent(id: string): Promise<{ success: boolean; data: Agent & { properties: any[] } }> {
        try {
            const response = await apiGet<Agent & { properties: any[] }>(`/agents/${id}`);
            return response;
        } catch (error) {
            console.error('Get agent error:', error);
            throw error;
        }
    },

    // Create agent profile (Admin only)
    async createAgent(data: CreateAgentData, profileImage?: File, coverImage?: File): Promise<{ success: boolean; data: Agent }> {
        try {
            if (profileImage || coverImage) {
                const formData = new FormData();

                // Add agent data
                Object.keys(data).forEach(key => {
                    if (key === 'experience' || key === 'contactInfo' || key === 'workingHours' || key === 'socialMedia') {
                        formData.append(key, JSON.stringify(data[key as keyof CreateAgentData]));
                    } else if (key === 'specialties' || key === 'languages' || key === 'certifications' || key === 'achievements') {
                        formData.append(key, JSON.stringify(data[key as keyof CreateAgentData]));
                    } else {
                        formData.append(key, String(data[key as keyof CreateAgentData]));
                    }
                });

                // Add images
                if (profileImage) formData.append('profileImage', profileImage);
                if (coverImage) formData.append('coverImage', coverImage);

                const response = await apiUpload<Agent>('/agents', formData);
                return response;
            } else {
                const response = await apiPost<Agent>('/agents', data);
                return response;
            }
        } catch (error) {
            console.error('Create agent error:', error);
            throw error;
        }
    },

    // Update agent profile
    async updateAgent(id: string, data: UpdateAgentData, profileImage?: File, coverImage?: File): Promise<{ success: boolean; data: Agent }> {
        try {
            if (profileImage || coverImage) {
                const formData = new FormData();

                // Add agent data
                Object.keys(data).forEach(key => {
                    if (key === 'experience' || key === 'contactInfo' || key === 'workingHours' || key === 'socialMedia') {
                        formData.append(key, JSON.stringify(data[key as keyof UpdateAgentData]));
                    } else if (key === 'specialties' || key === 'languages' || key === 'certifications' || key === 'achievements') {
                        formData.append(key, JSON.stringify(data[key as keyof UpdateAgentData]));
                    } else {
                        formData.append(key, String(data[key as keyof UpdateAgentData]));
                    }
                });

                // Add images
                if (profileImage) formData.append('profileImage', profileImage);
                if (coverImage) formData.append('coverImage', coverImage);

                const response = await apiUpload<Agent>(`/agents/${id}`, formData);
                return response;
            } else {
                const response = await apiPut<Agent>(`/agents/${id}`, data);
                return response;
            }
        } catch (error) {
            console.error('Update agent error:', error);
            throw error;
        }
    },

    // Delete agent profile (Admin only)
    async deleteAgent(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiDelete<{ message: string }>(`/agents/${id}`);
            return response;
        } catch (error) {
            console.error('Delete agent error:', error);
            throw error;
        }
    },

    // Get featured agents
    async getFeaturedAgents(limit: number = 6): Promise<{ success: boolean; count: number; data: Agent[] }> {
        try {
            const response = await apiGet<Agent[]>('/agents/featured', { limit });
            return response;
        } catch (error) {
            console.error('Get featured agents error:', error);
            throw error;
        }
    },

    // Add testimonial to agent
    async addTestimonial(agentId: string, data: AddTestimonialData): Promise<{ success: boolean; data: any }> {
        try {
            const response = await apiPost<any>(`/agents/${agentId}/testimonials`, data);
            return response;
        } catch (error) {
            console.error('Add testimonial error:', error);
            throw error;
        }
    },

    // Get agent statistics
    async getAgentStats(agentId: string): Promise<{ success: boolean; data: AgentStats }> {
        try {
            const response = await apiGet<AgentStats>(`/agents/${agentId}/stats`);
            return response;
        } catch (error) {
            console.error('Get agent stats error:', error);
            throw error;
        }
    },

    // Search agents
    async searchAgents(query: string, filters: Omit<AgentFilters, 'search'> = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Agent[];
    }> {
        try {
            const response = await apiGet<Agent[]>('/agents', { ...filters, search: query });
            return response;
        } catch (error) {
            console.error('Search agents error:', error);
            throw error;
        }
    },

    // Get agents by specialty
    async getAgentsBySpecialty(specialty: string, filters: Omit<AgentFilters, 'specialty'> = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Agent[];
    }> {
        try {
            const response = await apiGet<Agent[]>('/agents', { ...filters, specialty });
            return response;
        } catch (error) {
            console.error('Get agents by specialty error:', error);
            throw error;
        }
    },

    // Get agents by city
    async getAgentsByCity(city: string, filters: Omit<AgentFilters, 'city'> = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Agent[];
    }> {
        try {
            const response = await apiGet<Agent[]>('/agents', { ...filters, city });
            return response;
        } catch (error) {
            console.error('Get agents by city error:', error);
            throw error;
        }
    }
};

export default agentService;
