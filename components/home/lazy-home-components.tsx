"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Import skeleton components
import HeroSectionSkeleton from "./hero-section-skeleton";
import CategoryShowcaseSkeleton from "./category-showcase-skeleton";
import FeaturedProductsSkeleton from "./featured-products-skeleton";
import CustomerReviewsSkeleton from "./customer-reviews-skeleton";
import CtaSectionSkeleton from "./cta-section-skeleton";

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="p-4 border border-red-300 rounded-md bg-red-50 text-red-800" role="alert">
    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
    <p className="mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

// Dynamically import components with lazy loading
const HomeClient = dynamic(() => import("./home-client"), {
  loading: () => (
    <>
      <CategoryShowcaseSkeleton />
      <FeaturedProductsSkeleton />
    </>
  ),
  ssr: false,
});

const HeroSection = dynamic(() => import("./hero-section"), {
  loading: () => <HeroSectionSkeleton />,
  ssr: true, // Hero section should be rendered on the server for SEO
});

const CustomerReviews = dynamic(() => import("./customer-reviews"), {
  loading: () => <CustomerReviewsSkeleton />,
  ssr: true,
});

const CtaSection = dynamic(() => import("./cta-section"), {
  loading: () => <CtaSectionSkeleton />,
  ssr: false,
});

// Preloading functions
export const preloadHomeClient = () => {
  void import("./home-client");
};

export const preloadHeroSection = () => {
  void import("./hero-section");
};

export const preloadCustomerReviews = () => {
  void import("./customer-reviews");
};

export const preloadCtaSection = () => {
  void import("./cta-section");
};

// Preload all home components
export const preloadAllHomeComponents = () => {
  preloadHomeClient();
  preloadHeroSection();
  preloadCustomerReviews();
  preloadCtaSection();
};

// Lazy HomeClient component with error boundary
export function LazyHomeClient() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Suspense fallback={
        <>
          <CategoryShowcaseSkeleton />
          <FeaturedProductsSkeleton />
        </>
      }>
        <HomeClient />
      </Suspense>
    </ErrorBoundary>
  );
}

// Lazy HeroSection component with error boundary
export function LazyHeroSection() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>
    </ErrorBoundary>
  );
}

// Lazy CustomerReviews component with error boundary
export function LazyCustomerReviews() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Suspense fallback={<CustomerReviewsSkeleton />}>
        <CustomerReviews />
      </Suspense>
    </ErrorBoundary>
  );
}

// Lazy CtaSection component with error boundary
export function LazyCtaSection() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Suspense fallback={<CtaSectionSkeleton />}>
        <CtaSection />
      </Suspense>
    </ErrorBoundary>
  );
}

// Hook to preload components based on viewport
export function useHomePreloading() {
  useEffect(() => {
    // Preload the hero section immediately
    preloadHeroSection();

    // Preload the rest of the components after a delay
    const timer = setTimeout(() => {
      preloadHomeClient();
      preloadCustomerReviews();
      preloadCtaSection();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
}

export default {
  HomeClient: LazyHomeClient,
  HeroSection: LazyHeroSection,
  CustomerReviews: LazyCustomerReviews,
  CtaSection: LazyCtaSection,
  preloadHomeClient,
  preloadHeroSection,
  preloadCustomerReviews,
  preloadCtaSection,
  preloadAllHomeComponents,
  useHomePreloading,
};
