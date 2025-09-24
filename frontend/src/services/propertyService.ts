import { apiGet, apiPost, apiPut, apiDelete, apiPatch, apiUpload } from './api';
import { PaginationParams } from './api';

// Types
export interface Property {
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
    floors: number;
    facing?: 'north' | 'south' | 'east' | 'west' | 'north-east' | 'north-west' | 'south-east' | 'south-west';
    age: number;
    furnished: 'furnished' | 'semi-furnished' | 'unfurnished';
    parking: number;
    balcony: number;
    amenities: string[];
    images: Array<{
        url: string;
        alt: string;
        isPrimary: boolean;
    }>;
    location: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
        landmark?: string;
    };
    contact: {
        name: string;
        phone: string;
        email: string;
        whatsapp?: string;
    };
    owner: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    isActive: boolean;
    isFeatured: boolean;
    views: number;
    status: 'available' | 'sold' | 'rented' | 'under-negotiation';
    createdAt: string;
    updatedAt: string;
}

export interface PropertyFilters extends PaginationParams {
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

export interface CreatePropertyData {
    title: string;
    description: string;
    propertyType: string;
    listingType: string;
    price: number;
    area: {
        value: number;
        unit: string;
    };
    bedrooms?: number;
    bathrooms?: number;
    floors?: number;
    facing?: string;
    age?: number;
    furnished?: string;
    parking?: number;
    balcony?: number;
    amenities?: string[];
    location: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
        landmark?: string;
    };
    contact: {
        name: string;
        phone: string;
        email: string;
        whatsapp?: string;
    };
}

// Property Service Functions
export const propertyService = {
    // Get all properties with filters
    async getProperties(filters: PropertyFilters = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Property[];
    }> {
        try {
            const response = await apiGet<Property[]>('/properties', filters);
            return response;
        } catch (error) {
            console.error('Get properties error:', error);
            throw error;
        }
    },

    // Get single property by ID
    async getProperty(id: string): Promise<{ success: boolean; data: Property }> {
        try {
            const response = await apiGet<Property>(`/properties/${id}`);
            return response;
        } catch (error) {
            console.error('Get property error:', error);
            throw error;
        }
    },

    // Create new property
    async createProperty(data: CreatePropertyData, images?: File[]): Promise<{ success: boolean; data: Property }> {
        try {
            const formData = new FormData();

            // Add basic property data
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('propertyType', data.propertyType);
            formData.append('listingType', data.listingType);
            formData.append('price', data.price.toString());
            formData.append('bedrooms', data.bedrooms.toString());
            formData.append('bathrooms', data.bathrooms.toString());
            formData.append('floors', data.floors.toString());
            formData.append('age', data.age.toString());
            formData.append('furnished', data.furnished);
            formData.append('parking', data.parking.toString());
            formData.append('balcony', data.balcony.toString());

            // Add area data
            formData.append('area.value', data.area.value.toString());
            formData.append('area.unit', data.area.unit);

            // Add location data
            formData.append('location.address', data.location.address);
            formData.append('location.city', data.location.city);
            formData.append('location.state', data.location.state);
            formData.append('location.pincode', data.location.pincode);
            if (data.location.landmark) {
                formData.append('location.landmark', data.location.landmark);
            }

            // Add contact data
            formData.append('contact.name', data.contact.name);
            formData.append('contact.phone', data.contact.phone);
            formData.append('contact.email', data.contact.email);
            if (data.contact.whatsapp) {
                formData.append('contact.whatsapp', data.contact.whatsapp);
            }

            // Add optional fields
            if (data.facing) {
                formData.append('facing', data.facing);
            }

            // Add amenities as JSON string
            if (data.amenities && data.amenities.length > 0) {
                formData.append('amenities', JSON.stringify(data.amenities));
            }

            // Add images
            if (images && images.length > 0) {
                images.forEach((image, index) => {
                    formData.append('images', image);
                });
            }

            const response = await apiUpload<Property>('/properties', formData);
            return response;
        } catch (error) {
            console.error('Create property error:', error);
            throw error;
        }
    },

    // Update property
    async updateProperty(id: string, data: Partial<CreatePropertyData>, images?: File[]): Promise<{ success: boolean; data: Property }> {
        try {
            if (images && images.length > 0) {
                const formData = new FormData();

                // Add property data
                Object.keys(data).forEach(key => {
                    if (key === 'area' || key === 'location' || key === 'contact') {
                        formData.append(key, JSON.stringify(data[key as keyof CreatePropertyData]));
                    } else {
                        formData.append(key, String(data[key as keyof CreatePropertyData]));
                    }
                });

                // Add images
                images.forEach((image, index) => {
                    formData.append('images', image);
                });

                const response = await apiUpload<Property>(`/properties/${id}`, formData);
                return response;
            } else {
                const response = await apiPut<Property>(`/properties/${id}`, data);
                return response;
            }
        } catch (error) {
            console.error('Update property error:', error);
            throw error;
        }
    },

    // Delete property
    async deleteProperty(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiDelete<{ message: string }>(`/properties/${id}`);
            return response;
        } catch (error) {
            console.error('Delete property error:', error);
            throw error;
        }
    },

    // Toggle property status
    async togglePropertyStatus(id: string): Promise<{ success: boolean; data: { id: string; isActive: boolean } }> {
        try {
            const response = await apiPatch<{ id: string; isActive: boolean }>(`/properties/${id}/toggle`);
            return response;
        } catch (error) {
            console.error('Toggle property status error:', error);
            throw error;
        }
    },

    // Get featured properties
    async getFeaturedProperties(limit: number = 6): Promise<{ success: boolean; count: number; data: Property[] }> {
        try {
            const response = await apiGet<Property[]>('/properties/featured', { limit });
            return response;
        } catch (error) {
            console.error('Get featured properties error:', error);
            throw error;
        }
    },

    // Get properties by owner
    async getPropertiesByOwner(ownerId: string, page: number = 1, limit: number = 10): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Property[];
    }> {
        try {
            const response = await apiGet<Property[]>(`/properties/owner/${ownerId}`, { page, limit });
            return response;
        } catch (error) {
            console.error('Get properties by owner error:', error);
            throw error;
        }
    },

    // Search properties
    async searchProperties(query: string, filters: Omit<PropertyFilters, 'search'> = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Property[];
    }> {
        try {
            const response = await apiGet<Property[]>('/properties', { ...filters, search: query });
            return response;
        } catch (error) {
            console.error('Search properties error:', error);
            throw error;
        }
    }
};

// Get filter options for properties
export const getFilterOptions = async (): Promise<{
    success: boolean;
    data: {
        cities: string[];
        propertyTypes: string[];
        listingTypes: string[];
        budgetRanges: Array<{
            label: string;
            minPrice: number;
            maxPrice: number;
        }>;
    };
}> => {
    return apiGet('/properties/filter-options');
};

export default propertyService;
