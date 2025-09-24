import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '../../config/api';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye,
  Heart,
  Share2,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import { userService } from '../../services/userService';

interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: string;
  listingType: 'sale' | 'rent';
  price: number;
  area: {
    value: number;
    unit: string;
  };
  bedrooms: number;
  bathrooms: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  images: Array<{
    url: string;
    isPrimary: boolean;
  }>;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

const PropertyListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
  const [listingTypeFilter, setListingTypeFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const propertyTypes = [
    'apartment', 'house', 'villa', 'plot', 'commercial', 'office', 'shop', 'warehouse'
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-10', label: 'Under ₹10L' },
    { value: '10-50', label: '₹10L - ₹50L' },
    { value: '50-80', label: '₹50L - ₹80L' },
    { value: '80-100', label: '₹80L - ₹1Cr' },
    { value: '100+', label: 'Above ₹1Cr' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'area-large', label: 'Area: Large to Small' },
    { value: 'area-small', label: 'Area: Small to Large' }
  ];

  // Handle URL parameters on component mount
  useEffect(() => {
    const city = searchParams.get('city');
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    if (city) {
      setSearchTerm(city);
    }
    if (propertyType) {
      setPropertyTypeFilter(propertyType);
    }
    if (minPrice && maxPrice) {
      // Find matching price range
      const priceRangeValue = `${minPrice}-${maxPrice}`;
      const matchingRange = priceRanges.find(range => range.value === priceRangeValue);
      if (matchingRange) {
        setPriceRange(matchingRange.value);
      }
    }
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        propertyType: propertyTypeFilter !== 'all' ? propertyTypeFilter : undefined,
        listingType: listingTypeFilter !== 'all' ? listingTypeFilter : undefined,
        isActive: true, // Only show active properties for users
        sortBy: sortBy
      };

      // Add URL parameters if they exist
      const city = searchParams.get('city');
      const propertyType = searchParams.get('propertyType');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');

      if (city) {
        filters.city = city;
      }
      if (propertyType) {
        filters.propertyType = propertyType;
      }
      if (minPrice) {
        filters.minPrice = parseInt(minPrice);
      }
      if (maxPrice) {
        filters.maxPrice = parseInt(maxPrice);
      }

      // Add price range filter
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          filters.minPrice = min;
          filters.maxPrice = max;
        } else {
          filters.minPrice = min;
        }
      }

      const response = await userService.getProperties(filters);
      
      if (response.success) {
        setProperties(response.data);
        setTotalPages(response.pages);
        setTotalProperties(response.total);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentPage, searchTerm, propertyTypeFilter, listingTypeFilter, priceRange, sortBy]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const formatArea = (area: { value: number; unit: string }) => {
    return `${area.value} ${area.unit}`;
  };

  const handleViewProperty = (propertyId: string) => {
    // Track property view
    userService.trackPropertyView(propertyId);
    // Navigate to property details
    window.location.href = `/property/${propertyId}`;
  };

  const handleFavorite = (propertyId: string) => {
    // Implement favorite functionality
  };

  const handleShare = (propertyId: string) => {
    // Implement share functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Property</h1>
          <p className="text-gray-600">
            Discover {totalProperties} properties available for {listingTypeFilter === 'all' ? 'sale and rent' : listingTypeFilter}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by location, property type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={listingTypeFilter} onValueChange={setListingTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Listing Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid/List */}
        {properties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setPropertyTypeFilter('all');
                  setListingTypeFilter('all');
                  setPriceRange('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {properties.map((property) => (
              <Card key={property._id} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={property.images[0]?.url ? getImageUrl(property.images[0].url) : '/placeholder.jpg'}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {property.isFeatured && (
                      <Badge className="bg-yellow-500 text-white">Featured</Badge>
                    )}
                    <Badge className="bg-blue-600 text-white">
                      {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleFavorite(property._id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleShare(property._id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location.city}, {property.location.state}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms}
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {formatArea(property.area)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {property.views}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                      {property.listingType === 'rent' && (
                        <span className="text-sm font-normal text-gray-600">/month</span>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleViewProperty(property._id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListingPage;
