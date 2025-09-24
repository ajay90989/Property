import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '../../config/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Power,
  PowerOff,
  X,
  Loader2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';

interface Property {
  id: string;
  _id?: string; // MongoDB uses _id, but we map it to id
  title: string;
  propertyType: string;
  listingType: string;
  price: number;
  location: {
    city: string;
    state: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: {
    value: number;
    unit: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
  images: Array<{
    url: string;
    isPrimary: boolean;
  }>;
}

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setIsSearching(!!debouncedSearchTerm);
      
      const filters: any = {
        page: currentPage,
        limit: 10
        // Remove isActive filter to show both active and inactive properties in admin
      };

      // Only add search filter if it has a valid value
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        filters.search = debouncedSearchTerm.trim();
      }

      const response = await adminService.getProperties(filters);
      
      if (response.success) {
        // Map _id to id for consistency
        const mappedProperties = response.data.map((property: any) => ({
          ...property,
          id: property._id || property.id
        }));
        
        // Debug image data
        mappedProperties.forEach((property, index) => {
        });
        setProperties(mappedProperties);
        setTotalPages(response.pages);
        setTotalProperties(response.total);
      } else {
        console.error('API response not successful:', response);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to page 1 when search term changes
      setCurrentPage(1);
    }, 300); // 300ms delay - reduced for better responsiveness

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch properties when debounced search term or page changes
  useEffect(() => {
    fetchProperties();
  }, [currentPage, debouncedSearchTerm]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleEdit = (propertyId: string) => {
    // Navigate to edit property page with the property ID
    navigate(`/admin/properties/edit/${propertyId}`);
  };

  const handleDelete = async (propertyId: string) => {
    const property = properties.find(p => (p.id === propertyId) || (p._id === propertyId));
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${property?.title}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.deleteProperty(propertyId);
        if (response.success) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Property has been deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          // Refresh the properties list
          fetchProperties();
        } else {
          await Swal.fire({
            title: 'Error!',
            text: 'Failed to delete property. Please try again.',
            icon: 'error'
          });
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'An error occurred while deleting the property.',
          icon: 'error'
        });
      }
    }
  };


  const handleToggleStatus = async (propertyId: string) => {
    
    if (!propertyId || propertyId === 'undefined') {
      await Swal.fire({
        title: 'Error!',
        text: 'Invalid property ID. Please refresh the page and try again.',
        icon: 'error'
      });
      return;
    }
    
    const property = properties.find(p => (p.id === propertyId) || (p._id === propertyId));
    
    
    if (!property) {
      await Swal.fire({
        title: 'Error!',
        text: 'Property not found. Please refresh the page and try again.',
        icon: 'error'
      });
      return;
    }
    
    const currentStatus = property?.isActive ? 'active' : 'inactive';
    const newStatus = property?.isActive ? 'inactive' : 'active';
    
    const result = await Swal.fire({
      title: `Make Property ${newStatus === 'active' ? 'Active' : 'Inactive'}?`,
      html: `
        <div class="text-left">
          <p class="mb-3"><strong>Property:</strong> ${property?.title}</p>
          <p class="mb-3"><strong>Current Status:</strong> 
            <span class="px-2 py-1 rounded text-xs ${currentStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
              ${currentStatus.toUpperCase()}
            </span>
          </p>
          <p class="mb-3"><strong>New Status:</strong> 
            <span class="px-2 py-1 rounded text-xs ${newStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
              ${newStatus.toUpperCase()}
            </span>
          </p>
          <p class="text-sm text-gray-600">
            ${newStatus === 'inactive' ? 'This will hide the property from users.' : 'This will make the property visible to users.'}
          </p>
        </div>
      `,
      icon: newStatus === 'active' ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'active' ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, make it ${newStatus}!`,
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.togglePropertyStatus(propertyId);
        
        if (response.success) {
          await Swal.fire({
            title: 'Success!',
            text: `Property "${property?.title}" has been ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          
          // Refresh the properties list
          fetchProperties();
        } else {
          console.error('Toggle failed:', response);
          await Swal.fire({
            title: 'Error!',
            text: response.message || 'Failed to toggle property status. Please try again.',
            icon: 'error'
          });
        }
      } catch (error: any) {
        console.error('Error toggling property status:', error);
        await Swal.fire({
          title: 'Error!',
          text: `An error occurred while toggling property status: ${error.message}`,
          icon: 'error'
        });
      }
    }
  };

  const getPropertyTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      apartment: 'bg-blue-100 text-blue-800',
      villa: 'bg-purple-100 text-purple-800',
      house: 'bg-green-100 text-green-800',
      commercial: 'bg-orange-100 text-orange-800',
      plot: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getListingTypeBadge = (type: string) => {
    return type === 'sale' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  };

  // Properties are already filtered by the API - memoize to prevent unnecessary re-renders
  const filteredProperties = useMemo(() => properties, [properties]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ marginLeft: '228px', marginTop: '50px' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Properties</h1>
          <p className="text-gray-600 text-lg">Manage your property listings</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/properties/add')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                )}
                <Input
                  placeholder="Search properties by title, description, city, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card className="shadow-xl border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b">
          <CardTitle className="text-blue-800 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
            {debouncedSearchTerm ? (
              <span>
                Search Results for "{debouncedSearchTerm}" ({totalProperties} found)
              </span>
            ) : (
              <span>Property Listings ({totalProperties})</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <TableHead className="font-semibold text-gray-700">Property</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Price</TableHead>
                  <TableHead className="font-semibold text-gray-700">Location</TableHead>
                  <TableHead className="font-semibold text-gray-700">Details</TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex flex-col items-center">
                      <span>Status</span>
                      <div className="text-xs font-normal text-gray-500 mt-1 text-center">
                        Toggle to show/hide from users
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">Views</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 && debouncedSearchTerm ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <Search className="h-12 w-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
                          <p className="text-gray-500">
                            No properties match your search for "{debouncedSearchTerm}"
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setSearchTerm('')}
                          className="mt-4"
                        >
                          Clear Search
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property, index) => (
                  <TableRow 
                    key={property.id} 
                    className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={getImageUrl(property.images[0].url)}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                              onError={(e) => {
                          
                                const altSrc = getImageUrl(`/uploads/${property.images[0].url.split('/').pop()}`);
                                e.currentTarget.src = altSrc;
                                e.currentTarget.onerror = () => {
                                  e.currentTarget.style.display = 'none';
                                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (nextElement) {
                                    nextElement.style.display = 'flex';
                                  }
                                };
                              }}
                              onLoad={() => {
                              }}
                            />
                          ) : null}
                          <div 
                            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                            style={{ display: property.images && property.images.length > 0 ? 'none' : 'flex' }}
                          >
                            <div className="text-gray-400 text-xs text-center">
                              <div className="w-6 h-6 mx-auto mb-1 bg-gray-300 rounded flex items-center justify-center">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>No Image</div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm leading-tight">{property.title}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getPropertyTypeBadge(property.propertyType)}>
                          {property.propertyType}
                        </Badge>
                        <Badge className={getListingTypeBadge(property.listingType)}>
                          {property.listingType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{formatPrice(property.price)}</div>
                      {property.listingType === 'rent' && (
                        <div className="text-sm text-gray-500">per month</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{property.location.city}</div>
                        <div className="text-gray-500">{property.location.state}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{property.bedrooms} Beds, {property.bathrooms} Baths</div>
                        <div className="text-gray-500">
                          {property.area.value} {property.area.unit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={`px-3 py-1 text-xs font-medium ${
                            property.isActive 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {property.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                const propertyId = property.id || property._id || '';
                                handleToggleStatus(propertyId);
                              }}
                              className={`group relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                property.isActive 
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-200' 
                                  : 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg shadow-gray-200'
                              }`}
                              title={`Click to ${property.isActive ? 'hide from users' : 'show to users'}`}
                            >
                            <span
                              className={`inline-flex h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                                property.isActive ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {property.isActive ? (
                                  <Power className="h-3 w-3 text-green-600" />
                                ) : (
                                  <PowerOff className="h-3 w-3 text-gray-500" />
                                )}
                              </div>
                            </span>
                            </button>
                            
                          </div>
                        </div>
                        
                        {property.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 text-xs">
                            ⭐ Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="mr-1 h-4 w-4" />
                        {property.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(property.id || property._id || '')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {(!property.images || property.images.length === 0) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Navigate to edit page with focus on images
                              navigate(`/admin/properties/edit/${property.id || property._id || ''}?tab=images`);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Images
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(property.id || property._id || '')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
              <div className="text-sm text-gray-700 font-medium">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, filteredProperties.length)} of {filteredProperties.length} results
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 transition-all duration-200"
                >
                  Previous
                </Button>
                <span className="px-3 py-2 text-sm text-gray-600 bg-white rounded-md border">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="border-gray-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 transition-all duration-200"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Properties;
