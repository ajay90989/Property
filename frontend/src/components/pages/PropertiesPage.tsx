import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Bath, Bed, Square, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface PropertiesPageProps {
  onNavigate: (page: string, id?: string) => void;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  featured: boolean;
  agent: string;
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Premium Residential Plot",
    location: "Whitefield, Bangalore",
    price: "₹85 L",
    type: "Residential Plot",
    bedrooms: 0,
    bathrooms: 0,
    area: "2,400 sq ft",
    image: "https://images.unsplash.com/photo-1703222422733-9f63e66f2912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWNhbnQlMjBsYW5kJTIwcGxvdCUyMHJlc2lkZW50aWFsfGVufDF8fHx8MTc1NzMyNzY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
    agent: "Priya Sharma"
  },
  {
    id: "2",
    title: "Agricultural Farmland",
    location: "Devanahalli, Bangalore",
    price: "₹45 L",
    type: "Agricultural Land",
    bedrooms: 0,
    bathrooms: 0,
    area: "5 Acres",
    image: "https://images.unsplash.com/photo-1732275115492-13041e773431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBsYW5kJTIwZmFybWxhbmQlMjBwbG90fGVufDF8fHx8MTc1NzMyNzY1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
    agent: "Raj Kumar"
  },
  {
    id: "3",
    title: "Commercial Development Plot",
    location: "Cyber City, Gurgaon",
    price: "₹2.8 Cr",
    type: "Commercial Plot",
    bedrooms: 0,
    bathrooms: 0,
    area: "8,500 sq ft",
    image: "https://images.unsplash.com/photo-1685266325930-ffe4937f6eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwbGFuZCUyMGRldmVsb3BtZW50JTIwcGxvdHxlbnwxfHx8fDE3NTczMjc2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
    agent: "Anita Singh"
  },
  {
    id: "4",
    title: "Suburban Development Land",
    location: "Electronic City, Bangalore",
    price: "₹1.2 Cr",
    type: "Development Land",
    bedrooms: 0,
    bathrooms: 0,
    area: "4,200 sq ft",
    image: "https://images.unsplash.com/photo-1624000476670-08f63127e0be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMGxhbmQlMjBwbG90JTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzU3MzI3NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
    agent: "Vikram Patel"
  },
  {
    id: "5",
    title: "Industrial Land Parcel",
    location: "Hosur Road, Bangalore",
    price: "₹3.5 Cr",
    type: "Industrial Land",
    bedrooms: 0,
    bathrooms: 0,
    area: "12,000 sq ft",
    image: "https://images.unsplash.com/photo-1723598492850-5c537060be86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbGFuZCUyMHpvbmluZyUyMGFyZWF8ZW58MXx8fHwxNzU3MzI3NjYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
    agent: "Meera Joshi"
  },
  {
    id: "6",
    title: "Ready-to-Build Plot",
    location: "Sarjapur Road, Bangalore",
    price: "₹95 L",
    type: "Residential Plot",
    bedrooms: 0,
    bathrooms: 0,
    area: "3,000 sq ft",
    image: "https://images.unsplash.com/photo-1672421187802-e7e2ee8a2e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxhbmQlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc1NzMyNzY1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
    agent: "Suresh Gupta"
  }
];

export function PropertiesPage({ onNavigate }: PropertiesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || property.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const toggleLike = (propertyId: string) => {
    const newLiked = new Set(likedProperties);
    if (newLiked.has(propertyId)) {
      newLiked.delete(propertyId);
    } else {
      newLiked.add(propertyId);
    }
    setLikedProperties(newLiked);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Plot & Land</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our curated collection of premium plots and land parcels across India's top cities
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by location or property name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="residential plot">Residential Plot</option>
                  <option value="commercial plot">Commercial Plot</option>
                  <option value="agricultural land">Agricultural Land</option>
                  <option value="industrial land">Industrial Land</option>
                  <option value="development land">Development Land</option>
                </select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-6 border-gray-200 hover:border-blue-500"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">All Prices</option>
                      <option value="0-50L">Under ₹50L</option>
                      <option value="50L-1Cr">₹50L - ₹1Cr</option>
                      <option value="1Cr-3Cr">₹1Cr - ₹3Cr</option>
                      <option value="3Cr+">Above ₹3Cr</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zoning</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none">
                      <option value="all">Any Zoning</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="mixed">Mixed Use</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none">
                      <option value="all">Any Size</option>
                      <option value="0-1000">Under 1000 sq ft</option>
                      <option value="1000-2000">1000-2000 sq ft</option>
                      <option value="2000-3000">2000-3000 sq ft</option>
                      <option value="3000+">Above 3000 sq ft</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {mockProperties.length} plots & land parcels
          </p>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
            <option>Area: Largest First</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card 
              key={property.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-gray-200 overflow-hidden"
              onClick={() => onNavigate('property', property.id)}
            >
              <div className="relative">
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop&crop=center`}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(property.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`w-4 h-4 ${likedProperties.has(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </button>
                
                {property.featured && (
                  <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">{property.price}</span>
                  <Badge variant="outline" className="text-gray-600 border-gray-300">
                    {property.type}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      {property.area}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Listed by <span className="font-medium text-gray-900">{property.agent}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
            Load More Plots & Land
          </Button>
        </div>
      </div>
    </div>
  );
}