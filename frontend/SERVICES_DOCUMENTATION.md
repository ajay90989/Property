# Frontend Services Documentation

## Overview
This document describes the comprehensive service layer for the Property Management frontend application. The services are organized into modular, reusable functions that handle all API communications.

## Service Structure
```
src/services/
├── api.ts              # Base API configuration and helpers
├── authService.ts      # Authentication services
├── propertyService.ts  # Property management services
├── blogService.ts      # Blog management services
├── contactService.ts   # Contact form services
├── analyticsService.ts # Analytics tracking services
├── agentService.ts     # Agent management services
├── adminService.ts     # Admin-specific services
├── userService.ts      # User-specific services
└── index.ts           # Main exports
```

## Base API Service (`api.ts`)

### Configuration
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Helper Functions
- `apiRequest<T>()` - Generic API request function
- `apiGet<T>()` - GET request helper
- `apiPost<T>()` - POST request helper
- `apiPut<T>()` - PUT request helper
- `apiDelete<T>()` - DELETE request helper
- `apiPatch<T>()` - PATCH request helper
- `apiUpload<T>()` - File upload helper

### Features
- Automatic token management
- Error handling
- TypeScript support
- Response type safety

## Authentication Service (`authService.ts`)

### Functions
```typescript
// Login user
authService.login(data: LoginData): Promise<AuthResponse>

// Register user
authService.register(data: RegisterData): Promise<AuthResponse>

// Get current user
authService.getMe(): Promise<{ success: boolean; data: { user: User } }>

// Update profile
authService.updateProfile(data: UpdateProfileData): Promise<{ success: boolean; data: { user: User } }>

// Change password
authService.changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }>

// Logout
authService.logout(): void

// Get stored user data
authService.getStoredUser(): User | null

// Get stored token
authService.getStoredToken(): string | null

// Check authentication status
authService.isAuthenticated(): boolean
authService.isAdmin(): boolean
authService.isUser(): boolean
```

### Types
```typescript
interface User {
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

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'user' | 'admin';
}
```

## Property Service (`propertyService.ts`)

### Functions
```typescript
// Get all properties with filters
propertyService.getProperties(filters: PropertyFilters): Promise<PropertyResponse>

// Get single property
propertyService.getProperty(id: string): Promise<PropertyResponse>

// Create property
propertyService.createProperty(data: CreatePropertyData, images?: File[]): Promise<PropertyResponse>

// Update property
propertyService.updateProperty(id: string, data: Partial<CreatePropertyData>, images?: File[]): Promise<PropertyResponse>

// Delete property
propertyService.deleteProperty(id: string): Promise<Response>

// Toggle property status
propertyService.togglePropertyStatus(id: string): Promise<Response>

// Get featured properties
propertyService.getFeaturedProperties(limit: number): Promise<PropertyResponse>

// Get properties by owner
propertyService.getPropertiesByOwner(ownerId: string, page: number, limit: number): Promise<PropertyResponse>

// Search properties
propertyService.searchProperties(query: string, filters: PropertyFilters): Promise<PropertyResponse>
```

### Types
```typescript
interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: 'apartment' | 'house' | 'villa' | 'plot' | 'commercial' | 'office' | 'shop' | 'warehouse';
  listingType: 'sale' | 'rent';
  price: number;
  area: {
    value: number;
    unit: 'sqft' | 'sqm' | 'acre' | 'hectare';
  };
  bedrooms: number;
  bathrooms: number;
  // ... more properties
}

interface PropertyFilters {
  page?: number;
  limit?: number;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  facing?: string;
  furnished?: string;
  search?: string;
  isActive?: boolean;
}
```

## Blog Service (`blogService.ts`)

### Functions
```typescript
// Get all blogs
blogService.getBlogs(filters: BlogFilters): Promise<BlogResponse>

// Get single blog by slug
blogService.getBlogBySlug(slug: string): Promise<BlogResponse>

// Create blog
blogService.createBlog(data: CreateBlogData, featuredImage?: File): Promise<BlogResponse>

// Update blog
blogService.updateBlog(id: string, data: Partial<CreateBlogData>, featuredImage?: File): Promise<BlogResponse>

// Delete blog
blogService.deleteBlog(id: string): Promise<Response>

// Get featured blogs
blogService.getFeaturedBlogs(limit: number): Promise<BlogResponse>

// Get blog categories
blogService.getBlogCategories(): Promise<{ success: boolean; data: string[] }>

// Search blogs
blogService.searchBlogs(query: string, filters: BlogFilters): Promise<BlogResponse>

// Get blogs by category
blogService.getBlogsByCategory(category: string, filters: BlogFilters): Promise<BlogResponse>
```

## Contact Service (`contactService.ts`)

### Functions
```typescript
// Submit contact form
contactService.submitContact(data: SubmitContactData): Promise<ContactResponse>

// Get all contacts (Admin only)
contactService.getContacts(filters: ContactFilters): Promise<ContactResponse>

// Get single contact (Admin only)
contactService.getContact(id: string): Promise<ContactResponse>

// Update contact status (Admin only)
contactService.updateContactStatus(id: string, data: UpdateContactStatusData): Promise<ContactResponse>

// Respond to contact (Admin only)
contactService.respondToContact(id: string, data: RespondToContactData): Promise<ContactResponse>

// Get contact statistics (Admin only)
contactService.getContactStats(): Promise<ContactStatsResponse>
```

## Analytics Service (`analyticsService.ts`)

### Functions
```typescript
// Track analytics event
analyticsService.trackEvent(data: AnalyticsEvent): Promise<Response>

// Get dashboard analytics (Admin only)
analyticsService.getDashboardAnalytics(period: '7d' | '30d' | '90d' | '1y'): Promise<AnalyticsResponse>

// Get property analytics (Admin only)
analyticsService.getPropertyAnalytics(propertyId?: string, period: string): Promise<AnalyticsResponse>

// Get user analytics (Admin only)
analyticsService.getUserAnalytics(period: string): Promise<AnalyticsResponse>

// Convenience methods
analyticsService.trackPageView(page: string, metadata?: any): Promise<void>
analyticsService.trackPropertyView(propertyId: string, metadata?: any): Promise<void>
analyticsService.trackUserRegistration(userId: string, metadata?: any): Promise<void>
analyticsService.trackPropertyCreation(propertyId: string, metadata?: any): Promise<void>
analyticsService.trackContactForm(contactId: string, metadata?: any): Promise<void>
analyticsService.trackSearch(query: string, resultsCount: number, metadata?: any): Promise<void>
```

## Agent Service (`agentService.ts`)

### Functions
```typescript
// Get all agents
agentService.getAgents(filters: AgentFilters): Promise<AgentResponse>

// Get single agent
agentService.getAgent(id: string): Promise<AgentResponse>

// Create agent (Admin only)
agentService.createAgent(data: CreateAgentData, profileImage?: File, coverImage?: File): Promise<AgentResponse>

// Update agent
agentService.updateAgent(id: string, data: UpdateAgentData, profileImage?: File, coverImage?: File): Promise<AgentResponse>

// Delete agent (Admin only)
agentService.deleteAgent(id: string): Promise<Response>

// Get featured agents
agentService.getFeaturedAgents(limit: number): Promise<AgentResponse>

// Add testimonial
agentService.addTestimonial(agentId: string, data: AddTestimonialData): Promise<Response>

// Get agent statistics
agentService.getAgentStats(agentId: string): Promise<AgentStatsResponse>
```

## Admin Service (`adminService.ts`)

### Overview
The admin service combines all admin-specific functionality into a single, convenient interface.

### Functions
```typescript
// Dashboard
adminService.getDashboardData(period: string): Promise<DashboardResponse>

// Properties
adminService.getProperties(filters: any): Promise<PropertyResponse>
adminService.createProperty(data: any, images?: File[]): Promise<PropertyResponse>
adminService.updateProperty(id: string, data: any, images?: File[]): Promise<PropertyResponse>
adminService.deleteProperty(id: string): Promise<Response>
adminService.togglePropertyStatus(id: string): Promise<Response>

// Blogs
adminService.getBlogs(filters: any): Promise<BlogResponse>
adminService.createBlog(data: any, featuredImage?: File): Promise<BlogResponse>
adminService.updateBlog(id: string, data: any, featuredImage?: File): Promise<BlogResponse>
adminService.deleteBlog(id: string): Promise<Response>

// Contacts
adminService.getContacts(filters: any): Promise<ContactResponse>
adminService.getContact(id: string): Promise<ContactResponse>
adminService.updateContactStatus(id: string, data: any): Promise<ContactResponse>
adminService.respondToContact(id: string, data: any): Promise<ContactResponse>
adminService.getContactStats(): Promise<ContactStatsResponse>

// Agents
adminService.getAgents(filters: any): Promise<AgentResponse>
adminService.createAgent(data: any, profileImage?: File, coverImage?: File): Promise<AgentResponse>
adminService.updateAgent(id: string, data: any, profileImage?: File, coverImage?: File): Promise<AgentResponse>
adminService.deleteAgent(id: string): Promise<Response>

// Analytics
adminService.getAnalytics(period: string): Promise<AnalyticsResponse>
adminService.getPropertyAnalytics(propertyId?: string, period: string): Promise<AnalyticsResponse>
adminService.getUserAnalytics(period: string): Promise<AnalyticsResponse>
adminService.trackEvent(data: any): Promise<void>
```

## User Service (`userService.ts`)

### Overview
The user service provides user-facing functionality with automatic analytics tracking.

### Functions
```typescript
// Properties
userService.getProperties(filters: any): Promise<PropertyResponse>
userService.getProperty(id: string): Promise<PropertyResponse> // Auto-tracks view
userService.getFeaturedProperties(limit: number): Promise<PropertyResponse>
userService.searchProperties(query: string, filters: any): Promise<PropertyResponse> // Auto-tracks search

// Blogs
userService.getBlogs(filters: any): Promise<BlogResponse>
userService.getBlog(slug: string): Promise<BlogResponse> // Auto-tracks view
userService.getFeaturedBlogs(limit: number): Promise<BlogResponse>
userService.getBlogCategories(): Promise<{ success: boolean; data: string[] }>
userService.searchBlogs(query: string, filters: any): Promise<BlogResponse> // Auto-tracks search
userService.getBlogsByCategory(category: string, filters: any): Promise<BlogResponse>

// Agents
userService.getAgents(filters: any): Promise<AgentResponse>
userService.getAgent(id: string): Promise<AgentResponse> // Auto-tracks view
userService.getFeaturedAgents(limit: number): Promise<AgentResponse>
userService.searchAgents(query: string, filters: any): Promise<AgentResponse> // Auto-tracks search
userService.getAgentsBySpecialty(specialty: string, filters: any): Promise<AgentResponse>
userService.getAgentsByCity(city: string, filters: any): Promise<AgentResponse>
userService.addTestimonial(agentId: string, data: any): Promise<Response>

// Contact
userService.submitContact(data: any): Promise<ContactResponse> // Auto-tracks submission

// Analytics
userService.trackPageView(page: string, metadata?: any): Promise<void>
userService.trackPropertyView(propertyId: string, metadata?: any): Promise<void>
userService.trackSearch(query: string, resultsCount: number, metadata?: any): Promise<void>
```

## Usage Examples

### Basic Authentication
```typescript
import { authService } from './services/authService';

// Login
const loginData = { email: 'user@example.com', password: 'password123' };
const response = await authService.login(loginData);

// Check if user is authenticated
if (authService.isAuthenticated()) {
  const user = authService.getStoredUser();
 
}
```

### Property Management
```typescript
import { propertyService } from './services/propertyService';

// Get properties with filters
const properties = await propertyService.getProperties({
  page: 1,
  limit: 10,
  propertyType: 'apartment',
  listingType: 'sale',
  minPrice: 1000000,
  maxPrice: 5000000,
  city: 'Mumbai'
});

// Create property
const propertyData = {
  title: 'Luxury Apartment',
  description: 'Beautiful 3BHK apartment...',
  propertyType: 'apartment',
  listingType: 'sale',
  price: 2500000,
  // ... more data
};

const newProperty = await propertyService.createProperty(propertyData, imageFiles);
```

### Admin Dashboard
```typescript
import { adminService } from './services/adminService';

// Get dashboard data
const dashboardData = await adminService.getDashboardData('30d');


// Get contact statistics
const contactStats = await adminService.getContactStats();

```

### Analytics Tracking
```typescript
import { analyticsService } from './services/analyticsService';

// Track page view
await analyticsService.trackPageView('/properties', { source: 'homepage' });

// Track property view
await analyticsService.trackPropertyView('property123', { source: 'search' });

// Track search
await analyticsService.trackSearch('apartment mumbai', 25, { filters: { city: 'Mumbai' } });
```

## Error Handling

All services include comprehensive error handling:

```typescript
try {
  const response = await propertyService.getProperties();
  // Handle success
} catch (error) {
  console.error('Error fetching properties:', error);
  // Handle error
}
```

## TypeScript Support

All services are fully typed with TypeScript interfaces for:
- Request parameters
- Response data
- Error handling
- API responses

## Best Practices

1. **Use appropriate service**: Use `adminService` for admin functionality, `userService` for user functionality
2. **Handle errors**: Always wrap service calls in try-catch blocks
3. **Type safety**: Use TypeScript interfaces for better development experience
4. **Analytics**: User service automatically tracks analytics, admin service requires manual tracking
5. **File uploads**: Use the appropriate service methods for file uploads
6. **Pagination**: Use the pagination parameters for large datasets
7. **Filtering**: Use the provided filter interfaces for consistent filtering

## Migration from Legacy Auth

The legacy `Auth.tsx` file has been updated to use the new service structure:

```typescript
// Old way
import { UserLoginApi, UserRegisterApi } from './Service/Auth';

// New way (recommended)
import { authService } from './services/authService';

// Both work, but new way provides more functionality
const response = await authService.login(loginData);
```
