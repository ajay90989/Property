// API Configuration
export const API_BASE_URL = 'https://property-u6i3.onrender.com';


// Helper function to get full image URL
export const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // If it doesn't start with /, add it
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    // Otherwise, prepend the base URL
    return `${API_BASE_URL}${normalizedPath}`;
};

export default API_BASE_URL;
