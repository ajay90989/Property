import { PropertyCard } from "./PropertyCard";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { propertyService } from "../services/propertyService";
import { getImageUrl } from "../config/api";

interface Property {
  _id: string;
  title: string;
  location: {
    city?: string;
    state?: string;
    address?: string;
  };
  price: number;
  images?: Array<{
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }>;
  bedrooms: number;
  bathrooms: number;
  area: {
    value: number;
    unit: string;
  };
  propertyType: string;
  listingType: string;
  isActive: boolean;
}

interface FeaturedPropertiesProps {
  onNavigate?: (page: string, id?: string) => void;
  showResults?: boolean;
  filters?: any;
}

export function FeaturedProperties({ onNavigate, showResults = false, filters }: FeaturedPropertiesProps) {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        
        let response;
        if (filters && Object.keys(filters).length > 0) {
          // Use filtered properties API
          response = await propertyService.getProperties(filters);
        } else {
          // Use featured properties API
          response = await propertyService.getFeaturedProperties();
        }
        
        if (response.success) {
          setFeaturedProperties(response.data || []);
        } else {
          setFeaturedProperties([]);
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, [filters]);

  // Don't show featured properties if search results are being displayed
  if (showResults) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Land & Plots
          </h2>
          <p className="text-lg text-gray-600">
            Discover prime land opportunities and development-ready plots verified by our expert team
          </p>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
           
            {featuredProperties.map((property) => {
           
              return (
              <PropertyCard 
                key={property._id} 
                id={property._id}
                title={property.title}
                location={property.location?.city && property.location?.state 
                  ? `${property.location.city}, ${property.location.state}` 
                  : property.location?.city || property.location?.state || 'Location not specified'}
                price={`₹${(property.price).toFixed(1)}L`}
                image={property.images && property.images.length > 0 ? 
                  getImageUrl(property.images[0].url) : 
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop&crop=center'}
                beds={property.bedrooms}
                baths={property.bathrooms}
                area={`${property.area?.value || 0} ${property.area?.unit || 'sqft'}`}
                type={property.propertyType}
                rating={4.5}
                isVerified={true}
                onNavigate={(page, id) => {
                  if (page === 'property' && id) {
                    window.location.href = `/property/${id}`;
                  } else if (onNavigate) {
                    onNavigate(page, id);
                  }
                }}
              />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {filters && Object.keys(filters).length > 0 
                ? "No properties found matching your criteria. Try adjusting your filters." 
                : "No featured properties available at the moment."}
            </p>
            {filters && Object.keys(filters).length > 0 && (
              <p className="text-gray-400 text-sm mt-2">
                Applied filters: {Object.entries(filters).map(([key, value]) => `${key}: ${value}`).join(', ')}
              </p>
            )}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"
            onClick={() => onNavigate?.('properties')}
          >
            View All Plots & Land
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}