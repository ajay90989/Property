import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, MapPin, Phone, MessageCircle, Award } from "lucide-react";

interface AgentCardProps {
  id: string;
  name: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  propertiesSold: number;
  specialization: string[];
  isVerified?: boolean;
  onNavigate?: (page: string, id?: string) => void;
}

export function AgentCard({
  id,
  name,
  title,
  location,
  image,
  rating,
  reviewCount,
  propertiesSold,
  specialization,
  isVerified = false,
  onNavigate,
}: AgentCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 p-6">
      {/* Agent Info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Award className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating} ({reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">{propertiesSold}+</div>
          <div className="text-sm text-gray-600">Properties Sold</div>
        </div>
      </div>

      {/* Specialization */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Specialization:</div>
        <div className="flex flex-wrap gap-1">
          {specialization.map((spec, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex-1 rounded-xl"
          onClick={() => onNavigate?.('contact')}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl"
          onClick={() => onNavigate?.('agent', id)}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>
    </div>
  );
}