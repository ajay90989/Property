import { useState } from "react";
import { Search, Star, MapPin, Phone, Mail, Award, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";

interface AgentsPageProps {
  onNavigate: (page: string, id?: string) => void;
}

interface Agent {
  id: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  specialization: string[];
  propertiesSold: number;
  image: string;
  verified: boolean;
  languages: string[];
  description: string;
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Priya Sharma",
    title: "Senior Real Estate Consultant",
    location: "Mumbai, Maharashtra",
    rating: 4.9,
    reviews: 127,
    experience: "8+ years",
    specialization: ["Luxury Properties", "Commercial", "Investment"],
    propertiesSold: 156,
    image: "professional woman realtor",
    verified: true,
    languages: ["English", "Hindi", "Marathi"],
    description: "Specialized in luxury properties across Mumbai with a track record of successful high-value transactions."
  },
  {
    id: "2",
    name: "Raj Kumar",
    title: "Property Investment Specialist",
    location: "Bangalore, Karnataka",
    rating: 4.8,
    reviews: 89,
    experience: "6+ years",
    specialization: ["Residential", "Tech Hub Properties", "Investment"],
    propertiesSold: 134,
    image: "professional man realtor",
    verified: true,
    languages: ["English", "Hindi", "Kannada"],
    description: "Expert in Bangalore's tech corridor properties with deep knowledge of emerging areas and investment opportunities."
  },
  {
    id: "3",
    name: "Anita Singh",
    title: "Luxury Property Advisor",
    location: "Delhi NCR, Haryana",
    rating: 4.9,
    reviews: 156,
    experience: "10+ years",
    specialization: ["Luxury Homes", "Penthouses", "Commercial"],
    propertiesSold: 203,
    image: "professional woman consultant",
    verified: true,
    languages: ["English", "Hindi", "Punjabi"],
    description: "Top performer in Delhi NCR luxury market with extensive experience in high-end residential properties."
  },
  {
    id: "4",
    name: "Vikram Patel",
    title: "Residential Property Expert",
    location: "Pune, Maharashtra",
    rating: 4.7,
    reviews: 92,
    experience: "7+ years",
    specialization: ["Family Homes", "Apartments", "Ready to Move"],
    propertiesSold: 178,
    image: "professional man consultant",
    verified: true,
    languages: ["English", "Hindi", "Marathi", "Gujarati"],
    description: "Focused on helping families find their perfect homes in Pune's growing residential markets."
  },
  {
    id: "5",
    name: "Meera Joshi",
    title: "First-Time Buyer Specialist",
    location: "Chennai, Tamil Nadu",
    rating: 4.8,
    reviews: 73,
    experience: "5+ years",
    specialization: ["First-Time Buyers", "Affordable Housing", "IT Corridor"],
    propertiesSold: 98,
    image: "professional woman advisor",
    verified: true,
    languages: ["English", "Hindi", "Tamil"],
    description: "Dedicated to helping first-time buyers navigate the property market with personalized guidance and support."
  },
  {
    id: "6",
    name: "Suresh Gupta",
    title: "Commercial Real Estate Advisor",
    location: "Hyderabad, Telangana",
    rating: 4.9,
    reviews: 114,
    experience: "12+ years",
    specialization: ["Commercial", "Office Spaces", "Industrial"],
    propertiesSold: 267,
    image: "professional man senior",
    verified: true,
    languages: ["English", "Hindi", "Telugu"],
    description: "Senior advisor specializing in commercial real estate with expertise in office spaces and industrial properties."
  }
];

export function AgentsPage({ onNavigate }: AgentsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "all" || agent.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesSpecialization = selectedSpecialization === "all" || 
                                 agent.specialization.some(spec => spec.toLowerCase().includes(selectedSpecialization.toLowerCase()));
    return matchesSearch && matchesLocation && matchesSpecialization;
  });

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
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Agents</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with verified real estate professionals who understand your needs and local markets
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search agents by name or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                >
                  <option value="all">All Locations</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="delhi">Delhi NCR</option>
                  <option value="pune">Pune</option>
                  <option value="chennai">Chennai</option>
                  <option value="hyderabad">Hyderabad</option>
                </select>

                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                >
                  <option value="all">All Specializations</option>
                  <option value="luxury">Luxury Properties</option>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                  <option value="investment">Investment</option>
                  <option value="first-time">First-Time Buyers</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredAgents.length} of {mockAgents.length} agents
          </p>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white">
            <option>Sort by: Top Rated</option>
            <option>Most Experienced</option>
            <option>Most Reviews</option>
            <option>Most Sales</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card 
              key={agent.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-gray-200 p-6"
              onClick={() => onNavigate('agent', agent.id)}
            >
              <div className="text-center mb-6">
                <div className="relative mx-auto w-20 h-20 mb-4">
                  <Avatar className="w-20 h-20 mx-auto">
                    <img
                      src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                  {agent.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{agent.title}</p>
                <p className="text-sm text-gray-500 flex items-center justify-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {agent.location}
                </p>
              </div>

              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(agent.rating)}
                  </div>
                  <span className="font-medium text-gray-900">{agent.rating}</span>
                  <span className="text-gray-500">({agent.reviews} reviews)</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-semibold text-gray-900">{agent.experience}</div>
                    <div className="text-sm text-gray-600">Experience</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-semibold text-gray-900 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                      {agent.propertiesSold}
                    </div>
                    <div className="text-sm text-gray-600">Properties Sold</div>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.specialization.slice(0, 2).map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {agent.specialization.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.specialization.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {agent.description}
                </p>

                {/* Languages */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Languages</p>
                  <p className="text-sm text-gray-600">{agent.languages.join(", ")}</p>
                </div>

                {/* Contact Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle contact logic
                    }}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle email logic
                    }}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
            Load More Agents
          </Button>
        </div>
      </div>
    </div>
  );
}