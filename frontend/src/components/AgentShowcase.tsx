import { AgentCard } from "./AgentCard";
import { Button } from "./ui/button";
import { ArrowRight, Shield, Award, Users } from "lucide-react";

interface AgentShowcaseProps {
  onNavigate?: (page: string, id?: string) => void;
}

export function AgentShowcase({ onNavigate }: AgentShowcaseProps) {
  const featuredAgents = [
    {
      id: "1",
      name: "Priya Sharma",
      title: "Senior Real Estate Advisor",
      location: "Mumbai, Maharashtra",
      image: "https://images.unsplash.com/photo-1698065923333-de2f8d294f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU2NjM0OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviewCount: 127,
      propertiesSold: 85,
      specialization: ["Luxury Apartments", "Commercial", "Investment"],
      isVerified: true,
    },
    {
      id: "2",
      name: "Rajesh Kumar",
      title: "Property Investment Expert",
      location: "Bangalore, Karnataka",
      image: "https://images.unsplash.com/photo-1698065923333-de2f8d294f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU2NjM0OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviewCount: 94,
      propertiesSold: 62,
      specialization: ["Residential", "Villas", "Plots"],
      isVerified: true,
    },
    {
      id: "3",
      name: "Anita Patel",
      title: "Commercial Property Specialist",
      location: "Delhi NCR",
      image: "https://images.unsplash.com/photo-1698065923333-de2f8d294f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU2NjM0OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.7,
      reviewCount: 78,
      propertiesSold: 45,
      specialization: ["Office Space", "Retail", "Warehouses"],
      isVerified: true,
    },
  ];

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Connect with Verified Agents
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Work with top-rated, verified real estate professionals who understand your needs
          </p>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>100% Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Expert Professionals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>2000+ Happy Clients</span>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {featuredAgents.map((agent) => (
            <AgentCard key={agent.id} {...agent} onNavigate={onNavigate} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl"
            onClick={() => onNavigate?.('agents')}
          >
            View All Agents
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}