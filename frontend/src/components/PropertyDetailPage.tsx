import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Share, 
  Phone, 
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TreePine,
  Camera,
  Lock
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { propertyService, Property } from "../services/propertyService";
import { useAuth } from "../contexts/AuthContext";

interface PropertyDetailPageProps {
  propertyId?: string;
  onNavigate?: (page: string, id?: string) => void;
}


export function PropertyDetailPage({ propertyId, onNavigate }: PropertyDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const propertyIdToUse = propertyId || id;
        if (propertyIdToUse) {
          const response = await propertyService.getProperty(propertyIdToUse);
          if (response.success) {
            setProperty(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, id]);

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };


  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('properties');
    } else {
      navigate('/properties');
    }
  };

  const handleLogin = () => {
    if (onNavigate) {
      onNavigate('signin');
    } else {
      navigate('/signin');
    }
  };
 
  if(!isAuthenticated){
    navigate('/signin');
  }
  // Check if user is authenticated

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Plots & Land</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden bg-white">
              <div className="relative">
                <div className="aspect-video overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000${property.images[currentImageIndex].url}`}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error('Image failed to load:', e.currentTarget.src);
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                      onLoad={() => {
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full flex items-center justify-center bg-gray-100"
                    style={{ display: property.images && property.images.length > 0 ? 'none' : 'flex' }}
                  >
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-2">🏠</div>
                      <div className="text-sm">No Images Available</div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Arrows - only show if multiple images */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {property.images && property.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                )}

                {/* Show All Photos Button */}
                {property.images && property.images.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllImages(true)}
                    className="absolute bottom-4 right-4 bg-white"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Show All Photos
                  </Button>
                )}

                {/* Top Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Share className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {property.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Thumbnail Strip */}
              {property.images && property.images.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex space-x-3 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={`http://localhost:5000${image.url}`}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error('Thumbnail image failed to load:', e.currentTarget.src);
                            e.currentTarget.style.display = 'none';
                          }}
                          onLoad={() => {
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Property Information */}
            <Card className="p-6 bg-white">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-lg text-gray-600 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {property.location.city}, {property.location.state}
                  </p>
                </div>

                {/* Price & Type */}
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                    {property.listingType === 'rent' && (
                      <span className="text-sm font-normal text-gray-600">/month</span>
                    )}
                  </span>
                  <Badge variant="outline" className="text-gray-700 border-gray-300 text-lg px-4 py-2">
                    {property.propertyType}
                  </Badge>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold text-gray-900">{property.area.value} {property.area.unit}</div>
                    <div className="text-sm text-gray-600">Total Area</div>
                  </div>
                  {property.bedrooms > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  )}
                  {property.facing && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <TreePine className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-gray-900 capitalize">{property.facing}</div>
                      <div className="text-sm text-gray-600">Facing</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>

                {/* Property Specifications */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-medium text-gray-900 capitalize">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listing Type:</span>
                        <span className="font-medium text-gray-900 capitalize">{property.listingType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Furnished:</span>
                        <span className="font-medium text-gray-900 capitalize">{property.furnished}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium text-gray-900">{property.age} years</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Floors:</span>
                        <span className="font-medium text-gray-900">{property.floors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Parking:</span>
                        <span className="font-medium text-gray-900">{property.parking} spaces</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balcony:</span>
                        <span className="font-medium text-gray-900">{property.balcony}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views:</span>
                        <span className="font-medium text-gray-900">{property.views}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-blue-700 border-blue-300">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Name:</span>
                        <span className="font-medium text-gray-900">{property.contact.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">{property.contact.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">{property.contact.email}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-gray-900">{property.location.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pincode:</span>
                        <span className="font-medium text-gray-900">{property.location.pincode}</span>
                      </div>
                      {property.location.landmark && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Landmark:</span>
                          <span className="font-medium text-gray-900">{property.location.landmark}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="p-6 bg-white sticky top-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900">{property.contact.name}</h4>
                  <p className="text-sm text-gray-600">Property Contact</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call {property.contact.phone}
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Visit
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600 text-center">
                  Contact the property owner directly
                </p>
              </div>
            </Card>

            {/* Property Status */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {property.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active:</span>
                  <Badge className={property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {property.isActive ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Featured:</span>
                  <Badge className={property.isFeatured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                    {property.isFeatured ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium text-gray-900">{property.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium text-gray-900">{new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}