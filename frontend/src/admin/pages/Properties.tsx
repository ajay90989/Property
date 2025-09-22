import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Filter,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Property {
  id: string;
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperties([
        {
          id: '1',
          title: 'Luxury Villa in Mumbai',
          propertyType: 'villa',
          listingType: 'sale',
          price: 25000000,
          location: { city: 'Mumbai', state: 'Maharashtra' },
          bedrooms: 4,
          bathrooms: 3,
          area: { value: 3000, unit: 'sqft' },
          isActive: true,
          isFeatured: true,
          views: 45,
          createdAt: '2024-01-15',
          images: [{ url: '/placeholder.jpg', isPrimary: true }]
        },
        {
          id: '2',
          title: '3BHK Apartment in Delhi',
          propertyType: 'apartment',
          listingType: 'rent',
          price: 85000,
          location: { city: 'Delhi', state: 'Delhi' },
          bedrooms: 3,
          bathrooms: 2,
          area: { value: 1200, unit: 'sqft' },
          isActive: true,
          isFeatured: false,
          views: 32,
          createdAt: '2024-01-14',
          images: [{ url: '/placeholder.jpg', isPrimary: true }]
        },
        {
          id: '3',
          title: 'Commercial Space in Bangalore',
          propertyType: 'commercial',
          listingType: 'sale',
          price: 15000000,
          location: { city: 'Bangalore', state: 'Karnataka' },
          bedrooms: 0,
          bathrooms: 2,
          area: { value: 2000, unit: 'sqft' },
          isActive: false,
          isFeatured: false,
          views: 18,
          createdAt: '2024-01-13',
          images: [{ url: '/placeholder.jpg', isPrimary: true }]
        }
      ]);
      setTotalPages(3);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
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

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.propertyType === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && property.isActive) ||
                         (filterStatus === 'inactive' && !property.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your property listings</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Property Listings ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <img 
                            src={property.images[0]?.url || '/placeholder.jpg'} 
                            alt={property.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">
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
                      <div className="space-y-1">
                        <Badge className={property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {property.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {property.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(property.id)}>
                            {property.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, filteredProperties.length)} of {filteredProperties.length} results
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
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
