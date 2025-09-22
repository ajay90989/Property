import { PropertyCard } from "./PropertyCard";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface FeaturedPropertiesProps {
  onNavigate?: (page: string, id?: string) => void;
}

export function FeaturedProperties({ onNavigate }: FeaturedPropertiesProps) {
  const featuredProperties = [
    {
      id: "1",
      title: "Premium Residential Plot",
      location: "Whitefield, Bangalore",
      price: "₹85 L",
      image: "https://images.unsplash.com/photo-1703222422733-9f63e66f2912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWNhbnQlMjBsYW5kJTIwcGxvdCUyMHJlc2lkZW50aWFsfGVufDF8fHx8MTc1NzMyNzY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
      beds: undefined,
      baths: undefined,
      area: "2,400 sq ft",
      type: "Residential Plot",
      rating: 4.8,
      isVerified: true,
      dimensions: "40 x 60 ft",
      facing: "East Facing"
    },
    {
      id: "2",
      title: "Agricultural Farmland",
      location: "Devanahalli, Bangalore",
      price: "₹45 L",
      image: "https://images.unsplash.com/photo-1732275115492-13041e773431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBsYW5kJTIwZmFybWxhbmQlMjBwbG90fGVufDF8fHx8MTc1NzMyNzY1MXww&ixlib=rb-4.1.0&q=80&w=1080",
      beds: undefined,
      baths: undefined,
      area: "5 Acres",
      type: "Agricultural Land",
      rating: 4.6,
      isVerified: true,
      isFavorited: true,
      dimensions: "200 x 300 ft",
      facing: "South Facing"
    },
    {
      id: "3",
      title: "Commercial Development Plot",
      location: "Cyber City, Gurgaon",
      price: "₹2.8 Cr",
      image: "https://images.unsplash.com/photo-1685266325930-ffe4937f6eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwbGFuZCUyMGRldmVsb3BtZW50JTIwcGxvdHxlbnwxfHx8fDE3NTczMjc2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      beds: undefined,
      baths: undefined,
      area: "8,500 sq ft",
      type: "Commercial Plot",
      rating: 4.7,
      isVerified: true,
      dimensions: "85 x 100 ft",
      facing: "Main Road Facing"
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Land & Plots
          </h2>
          <p className="text-lg text-gray-600">
            Discover prime land opportunities and development-ready plots verified by our expert team
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} {...property} onNavigate={onNavigate} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"
            onClick={() => onNavigate?.('properties')}
          >
            View All Plots & Land
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}