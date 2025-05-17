"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Call to action section component for the home page
 * Displays a form for users to sign up
 */
export function CtaSection() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-20 relative" data-testid="cta-section">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F1E5C3]/20 z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-[800px] rounded-xl bg-white p-8 shadow-md md:p-12 relative overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.3), 0 4px 14px rgba(90, 154, 61, 0.1)' }}>
          <div className="flex flex-col items-center justify-center space-y-6 text-center animate-fade-up relative">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-[#194D33]">
                Ready to Transform Your Food Sourcing?
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-[600px] mx-auto">
                Join thousands of businesses that have simplified their supply chain with Pickle.
              </p>
            </div>
            <form className="w-full max-w-md space-y-4 animate-fade-up delay-200">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium text-left block">First Name</label>
                  <input
                    id="first-name"
                    type="text"
                    placeholder="John"
                    className="w-full rounded-md border border-[#5A9A3D]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A9A3D]/20"
                    data-testid="first-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium text-left block">Last Name</label>
                  <input
                    id="last-name"
                    type="text"
                    placeholder="Doe"
                    className="w-full rounded-md border border-[#5A9A3D]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A9A3D]/20"
                    data-testid="last-name-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-left block">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  className="w-full rounded-md border border-[#5A9A3D]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A9A3D]/20"
                  data-testid="email-input"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-left block">Company Name</label>
                <input
                  id="company"
                  type="text"
                  placeholder="Your Company"
                  className="w-full rounded-md border border-[#5A9A3D]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A9A3D]/20"
                  data-testid="company-input"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-[#F3B522] hover:bg-[#F3B522]/90 text-[#194D33] font-medium shadow-md"
                data-testid="get-started-button"
              >
                Get Started
              </Button>
              <p className="text-xs text-muted-foreground">
                By signing up, you agree to our <Link href="/terms" className="underline hover:text-[#5A9A3D]">Terms</Link> and <Link href="/privacy" className="underline hover:text-[#5A9A3D]">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
