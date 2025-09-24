import { apiPost, apiGet } from './api';

// Types
export interface AnalyticsEvent {
    type: 'page-view' | 'property-view' | 'user-registration' | 'property-created' | 'contact-form' | 'search';
    entityId?: string;
    entityType?: 'Property' | 'Blog' | 'User' | 'Contact';
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
}

export interface PageViewData {
    date: string;
    count: number;
}

export interface PropertyViewData {
    propertyId: string;
    title: string;
    views: number;
}

export interface UserRegistrationData {
    date: string;
    count: number;
}

export interface DeviceStats {
    _id: string;
    count: number;
}

export interface LocationStats {
    _id: string;
    count: number;
}

export interface DashboardAnalytics {
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
    pageViews: PageViewData[];
    propertyViews: PropertyViewData[];
    userRegistrations: UserRegistrationData[];
    deviceStats: DeviceStats[];
    locationStats: LocationStats[];
}

export interface UserActivity {
    userId: string;
    name: string;
    email: string;
    activityCount: number;
    lastActivity: string;
}

export interface UserAnalytics {
    userRegistrations: UserRegistrationData[];
    userActivity: UserActivity[];
}

export interface PropertyAnalytics {
    propertyId: string;
    title: string;
    views: number;
    uniqueViews: number;
}

// Analytics Service Functions
export const analyticsService = {
    // Track analytics event
    async trackEvent(data: AnalyticsEvent): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiPost<{ message: string }>('/analytics/track', data);
            return response;
        } catch (error) {
            console.error('Track analytics error:', error);
            throw error;
        }
    },

    // Get dashboard analytics (Admin only)
    async getDashboardAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<{ success: boolean; data: DashboardAnalytics }> {
        try {
            const response = await apiGet<DashboardAnalytics>('/analytics/dashboard', { period });
            return response;
        } catch (error) {
            console.error('Get dashboard analytics error:', error);
            throw error;
        }
    },

    // Get property analytics (Admin only)
    async getPropertyAnalytics(propertyId?: string, period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<{ success: boolean; data: PropertyAnalytics[] }> {
        try {
            const params: any = { period };
            if (propertyId) params.propertyId = propertyId;

            const response = await apiGet<PropertyAnalytics[]>('/analytics/properties', params);
            return response;
        } catch (error) {
            console.error('Get property analytics error:', error);
            throw error;
        }
    },

    // Get user analytics (Admin only)
    async getUserAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<{ success: boolean; data: UserAnalytics }> {
        try {
            const response = await apiGet<UserAnalytics>('/analytics/users', { period });
            return response;
        } catch (error) {
            console.error('Get user analytics error:', error);
            throw error;
        }
    },

    // Track page view
    async trackPageView(page: string, metadata?: Record<string, any>): Promise<void> {
        try {
            await this.trackEvent({
                type: 'page-view',
                metadata: {
                    page,
                    ...metadata
                }
            });
        } catch (error) {
            console.error('Track page view error:', error);
            // Don't throw error for analytics tracking
        }
    },

    // Track property view
    async trackPropertyView(propertyId: string, metadata?: Record<string, any>): Promise<void> {
        try {
            await this.trackEvent({
                type: 'property-view',
                entityId: propertyId,
                entityType: 'Property',
                metadata
            });
        } catch (error) {
            console.error('Track property view error:', error);
            // Don't throw error for analytics tracking
        }
    },

    // Track user registration
    async trackUserRegistration(userId: string, metadata?: Record<string, any>): Promise<void> {
        try {
            await this.trackEvent({
                type: 'user-registration',
                entityId: userId,
                entityType: 'User',
                metadata
            });
        } catch (error) {
            console.error('Track user registration error:', error);
            // Don't throw error for analytics tracking
        }
    },

    // Track property creation
    async trackPropertyCreation(propertyId: string, metadata?: Record<string, any>): Promise<void> {
        try {
            await this.trackEvent({
                type: 'property-created',
                entityId: propertyId,
                entityType: 'Property',
                metadata
            });
        } catch (error) {
            console.error('Track property creation error:', error);
            // Don't throw error for analytics tracking
        }
    },

    // Track contact form submission
    async trackContactForm(contactId: string, metadata?: Record<string, any>): Promise<void> {
        try {
            await this.trackEvent({
                type: 'contact-form',
                entityId: contactId,
                entityType: 'Contact',
                metadata
            });
        } catch (error) {
            console.error('Track contact form error:', error);
            // Don't throw error for analytics tracking
        }
    },

    // Track search
    async trackSearch(query: string, resultsCount: number, metadata?: Record<string, any>): Promise<void> {
        try {
            await this.trackEvent({
                type: 'search',
                metadata: {
                    query,
                    resultsCount,
                    ...metadata
                }
            });
        } catch (error) {
            console.error('Track search error:', error);
            // Don't throw error for analytics tracking
        }
    }
};

export default analyticsService;
