import { HeroSection } from "../HeroSection";
import { FeaturedProperties } from "../FeaturedProperties";
import { Features } from "../Features";

interface HomePageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      <FeaturedProperties onNavigate={onNavigate} />
      <Features />
    </>
  );
}