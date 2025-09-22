import { useState } from "react";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Award,
  TrendingUp,
  MessageCircle,
  Clock,
  CheckCircle,
  Building,
  Heart,
  Bath,
  Bed,
  Square
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AgentDetailPageProps {
  agentId?: string;
  onNavigate: (page: string, id?: string) => void;
}

// Mock agent data
const mockAgent = {
  id: "1",
  name: "Priya Sharma",
  title: "Senior Real Estate Consultant",
  location: "Mumbai, Maharashtra",
  rating: 4.9,
  reviews: 127,
  experience: "8+ years",
  specialization: ["Luxury Properties", "Commercial", "Investment"],
  propertiesSold: 156,
  languages: ["English", "Hindi", "Marathi"],
  description: "Specialized in luxury properties across Mumbai with a track record of successful high-value transactions. I believe in providing personalized service to each client and helping them find their dream property or make profitable investments.",
  verified: true,
  phone: "+91 98765 43210",
  email: "priya@bhoolink.com",
  image: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=300&h=300&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZWFsdG9yJTIwb2ZmaWNlfGVufDF8fHx8MTc1NzMxOTc0MHww&ixlib=rb-4.1.0&q=80&w=1080",
  achievements: [
    "Top Performer 2023",
    "Excellence in Customer Service",
    "100+ Properties Sold",
    "Certified Investment Advisor"
  ],
  workingHours: "Mon-Sat: 9:00 AM - 7:00 PM",
  responseTime: "Within 2 hours",
  aboutDetailed: "With over 8 years in the Mumbai real estate market, I have developed deep expertise in luxury properties, commercial spaces, and investment opportunities. My approach combines market knowledge with personalized service to ensure each client achieves their real estate goals. I have successfully completed transactions worth over ₹500 crores and maintain long-term relationships with my clients through trust and transparency."
};

const mockListings = [
  {
    id: "1",
    title: "Luxury Villa with Pool",
    location: "Bandra West, Mumbai",
    price: "₹8.5 Cr",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 5,
    area: "3,200 sq ft",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    status: "For Sale"
  },
  {
    id: "2",
    title: "Penthouse with City View",
    location: "Lower Parel, Mumbai", 
    price: "₹12.8 Cr",
    type: "Penthouse",
    bedrooms: 3,
    bathrooms: 4,
    area: "2,800 sq ft",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    status: "For Sale"
  },
  {
    id: "3",
    title: "Commercial Office Space",
    location: "BKC, Mumbai",
    price: "₹2.5 Cr",
    type: "Office",
    bedrooms: 0,
    bathrooms: 2,
    area: "1,500 sq ft",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    status: "Sold"
  }
];

const mockReviews = [
  {
    id: "1",
    name: "Rajesh Kumar",
    rating: 5,
    date: "2024-02-15",
    comment: "Priya helped us find our dream home in Bandra. Her knowledge of the area and negotiation skills saved us both time and money. Highly recommended!",
    property: "3BHK Apartment in Bandra"
  },
  {
    id: "2", 
    name: "Meera Patel",
    rating: 5,
    date: "2024-01-20",
    comment: "Excellent service from start to finish. Priya was very professional and guided us through every step of the buying process. Great experience!",
    property: "Villa in Juhu"
  },
  {
    id: "3",
    name: "Amit Singh",
    rating: 4,
    date: "2024-01-10",
    comment: "Good agent with solid market knowledge. She helped me invest in a commercial property that has already shown good returns.",
    property: "Commercial Space in BKC"
  }
];

export function AgentDetailPage({ agentId, onNavigate }: AgentDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview");

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
            onClick={() => onNavigate('agents')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Agents</span>
          </Button>
        </div>
      </div>

      {/* Agent Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden">
          <ImageWithFallback
            src={mockAgent.coverImage}
            alt="Office background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-32 pb-8">
            <Card className="bg-white p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <img src={mockAgent.image} alt={mockAgent.name} className="w-full h-full object-cover" />
                  </Avatar>
                  {mockAgent.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockAgent.name}</h1>
                      <p className="text-lg text-gray-600 mb-3">{mockAgent.title}</p>
                      <p className="text-gray-600 flex items-center mb-4">
                        <MapPin className="w-5 h-5 mr-2" />
                        {mockAgent.location}
                      </p>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {renderStars(mockAgent.rating)}
                          </div>
                          <span className="font-semibold text-gray-900">{mockAgent.rating}</span>
                          <span className="text-gray-600">({mockAgent.reviews} reviews)</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {mockAgent.responseTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 mr-1" />
                        {mockAgent.propertiesSold}
                      </div>
                      <div className="text-sm text-gray-600">Properties Sold</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{mockAgent.experience}</div>
                      <div className="text-sm text-gray-600">Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{mockAgent.reviews}</div>
                      <div className="text-sm text-gray-600">Client Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <Card className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About {mockAgent.name}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{mockAgent.aboutDetailed}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {mockAgent.specialization.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Languages</h4>
                      <p className="text-gray-600">{mockAgent.languages.join(", ")}</p>
                    </div>
                  </div>
                </Card>

                {/* Achievements */}
                <Card className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements & Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockAgent.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <Card className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{mockAgent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{mockAgent.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{mockAgent.workingHours}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold text-gray-900">{mockAgent.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Reviews</span>
                      <span className="font-semibold text-gray-900">{mockAgent.reviews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Properties Sold</span>
                      <span className="font-semibold text-gray-900">{mockAgent.propertiesSold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-semibold text-gray-900">{mockAgent.experience}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="listings">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-900">Current Listings</h3>
                <p className="text-gray-600">{mockListings.length} properties</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockListings.map((property) => (
                  <Card 
                    key={property.id} 
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white overflow-hidden"
                    onClick={() => onNavigate('property', property.id)}
                  >
                    <div className="relative">
                      <div className="aspect-video overflow-hidden">
                        <ImageWithFallback
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <Badge 
                        className={`absolute top-3 right-3 ${
                          property.status === 'Sold' ? 'bg-green-600' : 'bg-blue-600'
                        } text-white`}
                      >
                        {property.status}
                      </Badge>
                    </div>

                    <div className="p-6">
                      <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {property.title}
                      </h4>
                      <p className="text-gray-600 flex items-center mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-blue-600">{property.price}</span>
                        <Badge variant="outline">{property.type}</Badge>
                      </div>

                      {property.bedrooms > 0 && (
                        <div className="flex items-center space-x-4 text-gray-600">
                          <span className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            {property.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            {property.bathrooms}
                          </span>
                          <span className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            {property.area}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-900">Client Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(mockAgent.rating)}
                  </div>
                  <span className="font-semibold text-gray-900">{mockAgent.rating}</span>
                  <span className="text-gray-600">({mockAgent.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id} className="p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <p className="text-sm text-gray-600">{review.property}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Send a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Tell me about your property requirements..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Message
                  </Button>
                </form>
              </Card>

              <div className="space-y-6">
                <Card className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Direct Contact</h3>
                  <div className="space-y-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Call {mockAgent.phone}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email {mockAgent.email}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Video Call
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Office Hours</h3>
                  <p className="text-gray-700">{mockAgent.workingHours}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Average response time: {mockAgent.responseTime}
                  </p>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}