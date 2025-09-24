import { propertyService } from './propertyService';
import { blogService } from './blogService';
import { contactService } from './contactService';
import { agentService } from './agentService';
import { analyticsService } from './analyticsService';

// User Service Functions
export const userService = {
    // Get properties for users
    async getProperties(filters: any = {}): Promise<any> {
        try {
            const response = await propertyService.getProperties(filters);
            return response;
        } catch (error) {
            console.error('Get properties error:', error);
            throw error;
        }
    },

    // Get single property
    async getProperty(id: string): Promise<any> {
        try {
            const response = await propertyService.getProperty(id);
            // Track property view
            await analyticsService.trackPropertyView(id);
            return response;
        } catch (error) {
            console.error('Get property error:', error);
            throw error;
        }
    },

    // Get featured properties
    async getFeaturedProperties(limit: number = 6): Promise<any> {
        try {
            const response = await propertyService.getFeaturedProperties(limit);
            return response;
        } catch (error) {
            console.error('Get featured properties error:', error);
            throw error;
        }
    },

    // Search properties
    async searchProperties(query: string, filters: any = {}): Promise<any> {
        try {
            const response = await propertyService.searchProperties(query, filters);
            // Track search
            await analyticsService.trackSearch(query, response.count);
            return response;
        } catch (error) {
            console.error('Search properties error:', error);
            throw error;
        }
    },

    // Get blogs for users
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
    async getBlog(slug: string): Promise<any> {
        try {
            const response = await blogService.getBlogBySlug(slug);
            // Track page view
            await analyticsService.trackPageView(`blog/${slug}`);
            return response;
        } catch (error) {
            console.error('Get blog error:', error);
            throw error;
        }
    },

    // Get featured blogs
    async getFeaturedBlogs(limit: number = 3): Promise<any> {
        try {
            const response = await blogService.getFeaturedBlogs(limit);
            return response;
        } catch (error) {
            console.error('Get featured blogs error:', error);
            throw error;
        }
    },

    // Get blog categories
    async getBlogCategories(): Promise<any> {
        try {
            const response = await blogService.getBlogCategories();
            return response;
        } catch (error) {
            console.error('Get blog categories error:', error);
            throw error;
        }
    },

    // Search blogs
    async searchBlogs(query: string, filters: any = {}): Promise<any> {
        try {
            const response = await blogService.searchBlogs(query, filters);
            // Track search
            await analyticsService.trackSearch(query, response.count);
            return response;
        } catch (error) {
            console.error('Search blogs error:', error);
            throw error;
        }
    },

    // Get blogs by category
    async getBlogsByCategory(category: string, filters: any = {}): Promise<any> {
        try {
            const response = await blogService.getBlogsByCategory(category, filters);
            return response;
        } catch (error) {
            console.error('Get blogs by category error:', error);
            throw error;
        }
    },

    // Get agents for users
    async getAgents(filters: any = {}): Promise<any> {
        try {
            const response = await agentService.getAgents(filters);
            return response;
        } catch (error) {
            console.error('Get agents error:', error);
            throw error;
        }
    },

    // Get single agent
    async getAgent(id: string): Promise<any> {
        try {
            const response = await agentService.getAgent(id);
            // Track page view
            await analyticsService.trackPageView(`agent/${id}`);
            return response;
        } catch (error) {
            console.error('Get agent error:', error);
            throw error;
        }
    },

    // Get featured agents
    async getFeaturedAgents(limit: number = 6): Promise<any> {
        try {
            const response = await agentService.getFeaturedAgents(limit);
            return response;
        } catch (error) {
            console.error('Get featured agents error:', error);
            throw error;
        }
    },

    // Search agents
    async searchAgents(query: string, filters: any = {}): Promise<any> {
        try {
            const response = await agentService.searchAgents(query, filters);
            // Track search
            await analyticsService.trackSearch(query, response.count);
            return response;
        } catch (error) {
            console.error('Search agents error:', error);
            throw error;
        }
    },

    // Get agents by specialty
    async getAgentsBySpecialty(specialty: string, filters: any = {}): Promise<any> {
        try {
            const response = await agentService.getAgentsBySpecialty(specialty, filters);
            return response;
        } catch (error) {
            console.error('Get agents by specialty error:', error);
            throw error;
        }
    },

    // Get agents by city
    async getAgentsByCity(city: string, filters: any = {}): Promise<any> {
        try {
            const response = await agentService.getAgentsByCity(city, filters);
            return response;
        } catch (error) {
            console.error('Get agents by city error:', error);
            throw error;
        }
    },

    // Add testimonial to agent
    async addTestimonial(agentId: string, data: any): Promise<any> {
        try {
            const response = await agentService.addTestimonial(agentId, data);
            return response;
        } catch (error) {
            console.error('Add testimonial error:', error);
            throw error;
        }
    },

    // Submit contact form
    async submitContact(data: any): Promise<any> {
        try {
            const response = await contactService.submitContact(data);
            // Track contact form submission
            await analyticsService.trackContactForm(response.data._id);
            return response;
        } catch (error) {
            console.error('Submit contact error:', error);
            throw error;
        }
    },

    // Track page views
    async trackPageView(page: string, metadata?: any): Promise<void> {
        try {
            await analyticsService.trackPageView(page, metadata);
        } catch (error) {
            console.error('Track page view error:', error);
            // Don't throw error for analytics tracking
        }
    },

    // Track property views
    async trackPropertyView(propertyId: string, metadata?: any): Promise<void> {
        try {
            await analyticsService.trackPropertyView(propertyId, metadata);
        } catch (error) {
            console.error('Track property view error:', error);
            // Don't throw error for analytics tracking
        }
    },

    // Track searches
    async trackSearch(query: string, resultsCount: number, metadata?: any): Promise<void> {
        try {
            await analyticsService.trackSearch(query, resultsCount, metadata);
        } catch (error) {
            console.error('Track search error:', error);
            // Don't throw error for analytics tracking
        }
    }
};

export default userService;
