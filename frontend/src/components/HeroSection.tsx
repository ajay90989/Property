import { Button } from "./ui/button";
import { Search, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";
import { getFilterOptions } from "../services/propertyService";


interface BudgetRange {
  label: string;
  minPrice: number;
  maxPrice: number;
}

interface FilterOptions {
  cities: string[];
  propertyTypes: string[];
  listingTypes: string[];
  budgetRanges: BudgetRange[];
}

interface HeroSectionProps {
  onNavigate?: (page: string, id?: string) => void;
  onFiltersChange?: (filters: any) => void;
}

export function HeroSection({ onNavigate, onFiltersChange }: HeroSectionProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cities: [],
    propertyTypes: [],
    listingTypes: [],
    budgetRanges: []
  });
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    propertyType: '',
    budget: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await getFilterOptions();
        if (response.success) {
          const data = response.data;
         
          
          // Use default budget ranges (ignore backend budget ranges for now)
          const budgetRanges = [
            { label: 'Under ₹10L', minPrice: 0, maxPrice: 10 },
            { label: '₹10L - ₹50L', minPrice: 10, maxPrice: 50 },
            { label: '₹50L - ₹80L', minPrice: 50, maxPrice: 80 },
            { label: '₹80L - ₹1Cr', minPrice: 80, maxPrice: 100 },
            { label: 'Above ₹1Cr', minPrice: 100, maxPrice: 999999999 }
          ];
          
          const finalOptions = {
            cities: data.cities || [],
            propertyTypes: data.propertyTypes || [],
            listingTypes: data.listingTypes || [],
            budgetRanges: budgetRanges
          };
        
          setFilterOptions(finalOptions);
        }
      } catch (error) {
      
        // Set default options on error
        setFilterOptions({
          cities: [],
          propertyTypes: [],
          listingTypes: [],
          budgetRanges: [
            { label: 'Under ₹10L', minPrice: 0, maxPrice: 10 },
            { label: '₹10L - ₹50L', minPrice: 10, maxPrice: 50 },
            { label: '₹50L - ₹80L', minPrice: 50, maxPrice: 80 },
            { label: '₹80L - ₹1Cr', minPrice: 80, maxPrice: 100 },
            { label: 'Above ₹1Cr', minPrice: 100, maxPrice: 999999999 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = () => {
    setSearchLoading(true);
    

    
    // Build filter parameters
    const filters: any = {
      limit: 6,
      isActive: true
    };

    if (selectedFilters.location) {
      filters.city = selectedFilters.location;
    }
    if (selectedFilters.propertyType) {
      filters.propertyType = selectedFilters.propertyType;
    }
    if (selectedFilters.budget) {
      const budgetRange = filterOptions.budgetRanges.find(range => range.label === selectedFilters.budget);
      if (budgetRange) {
        filters.minPrice = budgetRange.minPrice;
        filters.maxPrice = budgetRange.maxPrice;
      }
    }

   
    
    // Pass filters to parent component
    onFiltersChange?.(filters);
    
    // Simulate a brief loading state
    setTimeout(() => {
      setSearchLoading(false);
    }, 500);
  };

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
                  <Select value={selectedFilters.location} onValueChange={(value: string) => handleFilterChange('location', value)}>
                    <SelectTrigger className="pl-10 h-12 rounded-xl border-gray-200 text-[12px]">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 leading-none">Property Type</label>
                  <Select value={selectedFilters.propertyType} onValueChange={(value: string) => handleFilterChange('propertyType', value)}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 text-[12px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 leading-none">Budget</label>
                <Select value={selectedFilters.budget} onValueChange={(value: string) => handleFilterChange('budget', value)}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 text-[12px]">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.budgetRanges.map((range, index) => (
                      <SelectItem key={range.label || index} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button 
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium leading-none"
                  onClick={handleSearch}
                  disabled={loading || searchLoading}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {searchLoading ? 'Searching...' : 'Find Plots & Land'}
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