"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Hero section component for the home page
 * Displays the main hero section with a call to action
 */
export function HeroSection() {
  return (
    <section className="w-full py-6 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-[#F1E5C3]/20 to-white" data-testid="hero-section">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5 z-0"></div>

      {/* Accent color strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5A9A3D] via-[#194D33] to-[#F3B522]"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-center">
          <div className="order-2 lg:order-1 space-y-3 animate-fade-left max-w-xl text-center lg:text-left" data-testid="hero-content">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-[#194D33]">
              Fresh Ingredients for Your Business
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Connect with quality food suppliers and get the best ingredients delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start" data-testid="hero-buttons">
              <Link href="/marketplace">
                <Button className="bg-[#5A9A3D] hover:bg-[#5A9A3D]/90 text-white shadow-md w-full sm:w-auto" data-testid="browse-products-button">Browse Products</Button>
              </Link>
              <Link href="/seller">
                <Button variant="outline" className="border-[#5A9A3D] text-[#5A9A3D] hover:bg-[#5A9A3D]/10 shadow-sm w-full sm:w-auto" data-testid="sell-button">Sell on Pickle</Button>
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex items-center justify-center animate-fade-right" data-testid="hero-image">
            <div className="relative w-full max-w-[250px] aspect-square">
              <Image
                src="/pickle-logo.png"
                alt="Pickle Logo"
                width={250}
                height={250}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
