import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Bed, Bath, Square, Heart, Share2, Star } from "lucide-react";
import { getImageUrl } from "../config/api";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  beds?: number;
  baths?: number;
  area: string;
  type: string;
  rating?: number;
  isVerified?: boolean;
  isFavorited?: boolean;
  dimensions?: string;
  facing?: string;
  onNavigate?: (page: string, id?: string) => void;
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  image,
  beds,
  baths,
  area,
  type,
  rating = 4.5,
  isVerified = false,
  isFavorited = false,
  dimensions,
  facing,
  onNavigate,
}: PropertyCardProps) {
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="relative overflow-hidden">
        {image && !image.includes('unsplash.com') ? (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            crossOrigin="anonymous"
            onError={(e) => {
              console.error('Image failed to load:', image);
              console.error('Error event:', e);
              // Try alternative URL if first fails
              if (image && image.includes('/uploads/')) {
                const altSrc = getImageUrl(`/uploads/${image.split('/').pop()}`);
                e.currentTarget.src = altSrc;
                e.currentTarget.onerror = () => {
                  console.error('Alternative URL also failed');
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                };
              }
            }}
            onLoad={() => {
            }}
          />
        ) : null}
        <div 
          className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
          style={{ display: image && !image.includes('unsplash.com') ? 'none' : 'flex' }}
        >
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">🏠</div>
            <div className="text-sm">No Image</div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-blue-600 text-white">
            {type}
          </Badge>
          {isVerified && (
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
              Verified
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className={`p-2 rounded-full transition-colors ${
            isFavorited 
              ? 'bg-red-100 text-red-600' 
              : 'bg-white/90 text-gray-600 hover:bg-red-100 hover:text-red-600'
          }`}>
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 rounded-full bg-white/90 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-lg font-bold text-gray-900">{price}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 leading-tight">{title}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{rating}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Property Details */}
        <div className="text-sm text-gray-600 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Square className="w-4 h-4" />
              <span>{area}</span>
            </div>
            {dimensions && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {dimensions}
              </span>
            )}
          </div>
          {facing && (
            <div className="text-xs text-gray-500">
              {facing}
            </div>
          )}
          {/* Show beds/baths only for property types that have them */}
          {(beds || baths) && (
            <div className="flex items-center space-x-4">
              {beds && (
                <div className="flex items-center space-x-1">
                  <Bed className="w-4 h-4" />
                  <span>{beds} Beds</span>
                </div>
              )}
              {baths && (
                <div className="flex items-center space-x-1">
                  <Bath className="w-4 h-4" />
                  <span>{baths} Baths</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl"
            onClick={() => onNavigate?.('contact')}
          >
            Contact
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl"
            onClick={() => onNavigate?.('property', id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}