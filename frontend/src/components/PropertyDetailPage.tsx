import { useState } from "react";
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
  Star,
  ChevronLeft,
  ChevronRight,
  Car,
  Wifi,
  Shield,
  TreePine,
  Camera
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyDetailPageProps {
  propertyId?: string;
  onNavigate: (page: string, id?: string) => void;
}

// Mock property data
const mockProperty = {
  id: "1",
  title: "Premium Residential Plot",
  location: "Whitefield, Bangalore",
  price: "₹85 L",
  type: "Residential Plot",
  dimensions: "40 x 60 ft",
  area: "2,400 sq ft",
  facing: "East Facing",
  plotType: "Corner Plot",
  zoning: "Residential",
  featured: true,
  description: "This premium residential plot offers excellent investment potential in the rapidly developing Whitefield area. The plot is ready for construction with all necessary approvals in place. Located in a well-planned layout with wide roads, proper drainage, and excellent connectivity to IT parks and the airport.",
  features: [
    "Clear Title",
    "DTCP Approved",
    "Ready for Construction",
    "Corner Plot",
    "Wide Road Access",
    "Proper Drainage",
    "Electricity Connection",
    "Water Connection Available"
  ],
  plotDetails: {
    soilType: "Red Soil",
    waterLevel: "20 feet",
    roadWidth: "40 feet",
    boundaryWall: "Available",
    utilities: ["Electricity", "Water", "Sewage"],
    approvals: ["DTCP", "BMRDA", "Gram Panchayat"]
  },
  images: [
    "https://images.unsplash.com/photo-1703222422733-9f63e66f2912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWNhbnQlMjBsYW5kJTIwcGxvdCUyMHJlc2lkZW50aWFsfGVufDF8fHx8MTc1NzMyNzY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1672421187802-e7e2ee8a2e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxhbmQlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc1NzMyNzY1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1624000476670-08f63127e0be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMGxhbmQlMjBwbG90JTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzU3MzI3NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
  ],
  agent: {
    id: "1",
    name: "Priya Sharma",
    title: "Senior Land Consultant",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=150&h=150&fit=crop&crop=face",
    phone: "+91 98765 43210",
    email: "priya@bhoolink.com"
  },
  nearbyPlaces: [
    { name: "ITPL", distance: "2.5 km", type: "IT Park" },
    { name: "Whitefield Railway Station", distance: "3.2 km", type: "Transport" },
    { name: "Columbia Asia Hospital", distance: "1.8 km", type: "Healthcare" },
    { name: "Ryan International School", distance: "1.5 km", type: "Education" }
  ]
};

export function PropertyDetailPage({ propertyId, onNavigate }: PropertyDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockProperty.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockProperty.images.length - 1 : prev - 1
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('properties')}
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
                  <ImageWithFallback
                    src={mockProperty.images[currentImageIndex]}
                    alt={mockProperty.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Navigation Arrows */}
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

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {mockProperty.images.length}
                </div>

                {/* Show All Photos Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowAllImages(true)}
                  className="absolute bottom-4 right-4 bg-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Show All Photos
                </Button>

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

                {mockProperty.featured && (
                  <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex space-x-3 overflow-x-auto">
                  {mockProperty.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Property Information */}
            <Card className="p-6 bg-white">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockProperty.title}</h1>
                  <p className="text-lg text-gray-600 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {mockProperty.location}
                  </p>
                </div>

                {/* Price & Type */}
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-blue-600">{mockProperty.price}</span>
                  <Badge variant="outline" className="text-gray-700 border-gray-300 text-lg px-4 py-2">
                    {mockProperty.type}
                  </Badge>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold text-gray-900">{mockProperty.area}</div>
                    <div className="text-sm text-gray-600">Total Area</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="w-6 h-6 mx-auto mb-2 text-gray-600 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-600"></div>
                    </div>
                    <div className="font-semibold text-gray-900">{mockProperty.dimensions}</div>
                    <div className="text-sm text-gray-600">Dimensions</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <TreePine className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold text-gray-900">{mockProperty.facing}</div>
                    <div className="text-sm text-gray-600">Facing</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold text-gray-900">{mockProperty.plotType}</div>
                    <div className="text-sm text-gray-600">Plot Type</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{mockProperty.description}</p>
                </div>

                {/* Plot Specifications */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Plot Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Soil Type:</span>
                        <span className="font-medium text-gray-900">{mockProperty.plotDetails.soilType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Water Level:</span>
                        <span className="font-medium text-gray-900">{mockProperty.plotDetails.waterLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Road Width:</span>
                        <span className="font-medium text-gray-900">{mockProperty.plotDetails.roadWidth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Boundary Wall:</span>
                        <span className="font-medium text-gray-900">{mockProperty.plotDetails.boundaryWall}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 block mb-2">Available Utilities:</span>
                        <div className="flex flex-wrap gap-2">
                          {mockProperty.plotDetails.utilities.map((utility, index) => (
                            <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                              {utility}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-2">Approvals:</span>
                        <div className="flex flex-wrap gap-2">
                          {mockProperty.plotDetails.approvals.map((approval, index) => (
                            <Badge key={index} variant="outline" className="text-blue-700 border-blue-300">
                              {approval}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {mockProperty.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nearby Places */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Nearby</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockProperty.nearbyPlaces.map((place, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{place.name}</div>
                          <div className="text-sm text-gray-600">{place.type}</div>
                        </div>
                        <div className="text-sm font-medium text-blue-600">{place.distance}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <Card className="p-6 bg-white sticky top-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Agent</h3>
              
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-16 h-16">
                  <img src={mockProperty.agent.image} alt={mockProperty.agent.name} className="w-full h-full object-cover" />
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900">{mockProperty.agent.name}</h4>
                  <p className="text-sm text-gray-600">{mockProperty.agent.title}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(mockProperty.agent.rating)}
                    <span className="text-sm text-gray-600 ml-2">({mockProperty.agent.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call {mockProperty.agent.phone}
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
                  Trusted land consultant with verified credentials
                </p>
              </div>
            </Card>

            {/* Similar Plots */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Similar Plots</h3>
              <div className="space-y-4">
                {[
                  { title: "Agricultural Land", location: "Devanahalli, Bangalore", price: "₹45 L", image: "https://images.unsplash.com/photo-1732275115492-13041e773431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBsYW5kJTIwZmFybWxhbmQlMjBwbG90fGVufDF8fHx8MTc1NzMyNzY1MXww&ixlib=rb-4.1.0&q=80&w=150" },
                  { title: "Commercial Plot", location: "Electronic City, Bangalore", price: "₹1.2 Cr", image: "https://images.unsplash.com/photo-1685266325930-ffe4937f6eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwbGFuZCUyMGRldmVsb3BtZW50JTIwcGxvdHxlbnwxfHx8fDE3NTczMjc2NTV8MA&ixlib=rb-4.1.0&q=80&w=150" },
                  { title: "Ready-to-Build Plot", location: "Sarjapur Road, Bangalore", price: "₹95 L", image: "https://images.unsplash.com/photo-1672421187802-e7e2ee8a2e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxhbmQlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc1NzMyNzY1OXww&ixlib=rb-4.1.0&q=80&w=150" }
                ].map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                        <p className="text-sm text-gray-600 truncate">{item.location}</p>
                        <p className="text-sm font-semibold text-blue-600">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View More Plots
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}