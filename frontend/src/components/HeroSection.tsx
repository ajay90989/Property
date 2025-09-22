import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MapPin, Filter, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface HeroSectionProps {
  onNavigate?: (page: string, id?: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Gateway to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Prime Land & Plots
            </span>{" "}
            Investment
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
            Discover verified plots, agricultural land, and development opportunities with clear titles
            and expert guidance from trusted land consultants.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 leading-none">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Enter city, area..."
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 text-[12px] leading-none text-left"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 leading-none">Property Type</label>
                <Select>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 text-[12px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential-plot">Residential Plot</SelectItem>
                    <SelectItem value="commercial-plot">Commercial Plot</SelectItem>
                    <SelectItem value="agricultural">Agricultural Land</SelectItem>
                    <SelectItem value="industrial">Industrial Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 leading-none">Budget</label>
                <Select>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 text-[12px]">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-50l">Under ₹50L</SelectItem>
                    <SelectItem value="50l-1cr">₹50L - ₹1Cr</SelectItem>
                    <SelectItem value="1cr-2cr">₹1Cr - ₹2Cr</SelectItem>
                    <SelectItem value="above-2cr">Above ₹2Cr</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button 
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium leading-none"
                  onClick={() => onNavigate?.('properties')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Plots & Land
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">25K+</div>
            <div className="text-gray-600">Plots & Land Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-gray-600">Verified Land Consultants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">12K+</div>
            <div className="text-gray-600">Successful Deals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">80+</div>
            <div className="text-gray-600">Cities Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
}