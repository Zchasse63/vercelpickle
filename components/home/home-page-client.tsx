"use client";

import { 
  LazyHeroSection, 
  LazyHomeClient, 
  LazyCustomerReviews, 
  LazyCtaSection,
  useHomePreloading
} from "@/components/home/lazy-home-components";

/**
 * Home page client component
 * This component is loaded on the client side and uses lazy loading for its children
 */
export function HomePageClient() {
  // Use the custom hook to preload components
  useHomePreloading();
  
  return (
    <>
      <LazyHeroSection />
      <LazyHomeClient />
      <LazyCustomerReviews />
      <LazyCtaSection />
    </>
  );
}
