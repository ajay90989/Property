import { apiGet, apiPost, apiPut, apiDelete, apiUpload, apiPatch } from './api';
import { PaginationParams } from './api';

// Types
export interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: {
        url: string;
        alt: string;
    };
    author?: {
        _id: string;
        name: string;
        email: string;
    };
    category: 'real-estate' | 'investment' | 'market-trends' | 'home-decor' | 'legal' | 'tips' | 'news';
    tags: string[];
    status: 'draft' | 'published' | 'archived';
    isFeatured: boolean;
    views: number;
    likes: number;
    readTime: number;
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
    };
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BlogFilters extends PaginationParams {
    category?: string;
    status?: string;
    search?: string;
    featured?: boolean;
}

export interface CreateBlogData {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags?: string[];
    status?: 'draft' | 'published' | 'archived';
    isFeatured?: boolean;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
    };
    imageAlt?: string;
}

// Blog Service Functions
export const blogService = {
    // Get all blogs with filters
    async getBlogs(filters: BlogFilters = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Blog[];
    }> {
        try {
            const response = await apiGet<Blog[]>('/blogs', filters);
            return response;
        } catch (error) {
            console.error('Get blogs error:', error);
            throw error;
        }
    },

    // Get single blog by slug
    async getBlogBySlug(slug: string): Promise<{ success: boolean; data: Blog }> {
        try {
            const response = await apiGet<Blog>(`/blogs/${slug}`);
            return response;
        } catch (error) {
            console.error('Get blog error:', error);
            throw error;
        }
    },

    // Get single blog by ID (for admin)
    async getBlog(id: string): Promise<{ success: boolean; data: Blog }> {
        try {
            const url = `/blogs/admin/${id}`;
            const response = await apiGet<Blog>(url);
            return response;
        } catch (error) {
            console.error('Get blog error:', error);
            throw error;
        }
    },

    // Create new blog
    async createBlog(data: CreateBlogData, featuredImage?: File): Promise<{ success: boolean; data: Blog }> {
        try {
            if (featuredImage) {
                const formData = new FormData();

                // Add blog data
                Object.keys(data).forEach(key => {
                    if (key === 'seo') {
                        formData.append(key, JSON.stringify(data[key as keyof CreateBlogData]));
                    } else if (key === 'tags') {
                        formData.append(key, JSON.stringify(data[key as keyof CreateBlogData]));
                    } else {
                        formData.append(key, String(data[key as keyof CreateBlogData]));
                    }
                });

                // Add featured image
                formData.append('featuredImage', featuredImage);

                const response = await apiUpload<Blog>('/blogs', formData);
                return response;
            } else {
                const response = await apiPost<Blog>('/blogs', data);
                return response;
            }
        } catch (error) {
            console.error('Create blog error:', error);
            throw error;
        }
    },

    // Update blog
    async updateBlog(id: string, data: Partial<CreateBlogData>, featuredImage?: File): Promise<{ success: boolean; data: Blog }> {
        try {
            if (featuredImage) {
                const formData = new FormData();

                // Add blog data
                Object.keys(data).forEach(key => {
                    if (key === 'seo') {
                        formData.append(key, JSON.stringify(data[key as keyof CreateBlogData]));
                    } else if (key === 'tags') {
                        formData.append(key, JSON.stringify(data[key as keyof CreateBlogData]));
                    } else {
                        formData.append(key, String(data[key as keyof CreateBlogData]));
                    }
                });

                // Add featured image
                formData.append('featuredImage', featuredImage);

                const response = await apiUpload<Blog>(`/blogs/${id}`, formData, 'PUT');
                return response;
            } else {
                const response = await apiPut<Blog>(`/blogs/${id}`, data);
                return response;
            }
        } catch (error) {
            console.error('Update blog error:', error);
            throw error;
        }
    },

    // Delete blog
    async deleteBlog(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiDelete<{ message: string }>(`/blogs/${id}`);
            return response;
        } catch (error) {
            console.error('Delete blog error:', error);
            throw error;
        }
    },

    // Toggle blog status
    async toggleBlogStatus(id: string): Promise<{ success: boolean; data: { id: string; isActive: boolean } }> {
        try {
            const response = await apiPatch<{ id: string; isActive: boolean }>(`/blogs/${id}/toggle`);
            return response;
        } catch (error) {
            console.error('Toggle blog status error:', error);
            throw error;
        }
    },

    // Get featured blogs
    async getFeaturedBlogs(limit: number = 3): Promise<{ success: boolean; count: number; data: Blog[] }> {
        try {
            const response = await apiGet<Blog[]>('/blogs/featured', { limit });
            return response;
        } catch (error) {
            console.error('Get featured blogs error:', error);
            throw error;
        }
    },

    // Get blog categories
    async getBlogCategories(): Promise<{ success: boolean; data: string[] }> {
        try {
            const response = await apiGet<string[]>('/blogs/categories');
            return response;
        } catch (error) {
            console.error('Get blog categories error:', error);
            throw error;
        }
    },

    // Search blogs
    async searchBlogs(query: string, filters: Omit<BlogFilters, 'search'> = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Blog[];
    }> {
        try {
            const response = await apiGet<Blog[]>('/blogs', { ...filters, search: query });
            return response;
        } catch (error) {
            console.error('Search blogs error:', error);
            throw error;
        }
    },

    // Get blogs by category
    async getBlogsByCategory(category: string, filters: Omit<BlogFilters, 'category'> = {}): Promise<{
        success: boolean;
        count: number;
        total: number;
        page: number;
        pages: number;
        data: Blog[];
    }> {
        try {
            const response = await apiGet<Blog[]>('/blogs', { ...filters, category });
            return response;
        } catch (error) {
            console.error('Get blogs by category error:', error);
            throw error;
        }
    }
};

export default blogService;
