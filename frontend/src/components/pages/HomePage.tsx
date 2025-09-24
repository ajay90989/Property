import { HeroSection } from "../HeroSection";
import { FeaturedProperties } from "../FeaturedProperties";
import { Features } from "../Features";
import { userService } from "../../services/userService";
import { useState } from "react";

interface HomePageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filters, setFilters] = useState<any>(null);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <>
      <HeroSection onNavigate={onNavigate} onFiltersChange={handleFiltersChange} />
      <FeaturedProperties onNavigate={onNavigate} showResults={showSearchResults} filters={filters} />
      <Features />
    </>
  );
}