// Export all services
export { default as apiService } from './api';
export { default as authService } from './authService';
export { default as propertyService } from './propertyService';
export { default as blogService } from './blogService';
export { default as contactService } from './contactService';
export { default as analyticsService } from './analyticsService';
export { default as agentService } from './agentService';
export { default as adminService } from './adminService';
export { default as userService } from './userService';

// Export types
export type { ApiResponse, PaginationParams } from './api';
export type { User, LoginData, RegisterData, AuthResponse, UpdateProfileData, ChangePasswordData } from './authService';
export type { Property, PropertyFilters, CreatePropertyData } from './propertyService';
export type { Blog, BlogFilters, CreateBlogData } from './blogService';
export type { Contact, ContactFilters, SubmitContactData, UpdateContactStatusData, RespondToContactData, ContactStats } from './contactService';
export type { AnalyticsEvent, DashboardAnalytics, PropertyAnalytics, UserAnalytics } from './analyticsService';
export type { Agent, AgentFilters, CreateAgentData, UpdateAgentData, AddTestimonialData, AgentStats } from './agentService';

// Re-export everything for convenience
export * from './api';
export * from './authService';
export * from './propertyService';
export * from './blogService';
export * from './contactService';
export * from './analyticsService';
export * from './agentService';
export * from './adminService';
export * from './userService';
