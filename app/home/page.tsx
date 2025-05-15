import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeClient } from "@/components/home/home-client"

export default function HomePage() {
  return (
    <div className="space-y-8 pb-16">
      <main>
      {/* Hero Section */}
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

      {/* Dynamic Categories and Featured Products */}
      <HomeClient />

      {/* Customer Reviews Section */}
      <section className="w-full py-8 md:py-12 bg-[#F1E5C3]/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#194D33]">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
                Hear from businesses that have transformed their food sourcing with Pickle
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <Card className="hover-lift shadow-sm" style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.3), 0 4px 14px rgba(90, 154, 61, 0.1)' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#F3B522]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic mb-4">
                  "Pickle has completely transformed how we source ingredients for our restaurant. The quality is exceptional and the ordering process is seamless."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#5A9A3D]/20 flex items-center justify-center text-[#5A9A3D] font-bold mr-3">
                    JD
                  </div>
                  <div>
                    <p className="font-medium text-[#194D33]">John Doe</p>
                    <p className="text-xs text-muted-foreground">Executive Chef, Farm to Table</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review 2 */}
            <Card className="hover-lift shadow-sm" style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.3), 0 4px 14px rgba(90, 154, 61, 0.1)' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#F3B522]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic mb-4">
                  "We've been able to connect with local suppliers and reduce our carbon footprint while maintaining the highest quality standards. Pickle makes it easy."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#5A9A3D]/20 flex items-center justify-center text-[#5A9A3D] font-bold mr-3">
                    JS
                  </div>
                  <div>
                    <p className="font-medium text-[#194D33]">Jane Smith</p>
                    <p className="text-xs text-muted-foreground">Procurement Manager, Green Eats Co.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review 3 */}
            <Card className="hover-lift shadow-sm" style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.3), 0 4px 14px rgba(90, 154, 61, 0.1)' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#F3B522]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic mb-4">
                  "The variety of specialty products available on Pickle has allowed us to create unique menu offerings that set us apart from competitors."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#5A9A3D]/20 flex items-center justify-center text-[#5A9A3D] font-bold mr-3">
                    RJ
                  </div>
                  <div>
                    <p className="font-medium text-[#194D33]">Robert Johnson</p>
                    <p className="text-xs text-muted-foreground">Owner, Culinary Innovations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-8 md:py-16 lg:py-20 relative">
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
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium text-left block">Last Name</label>
                    <input
                      id="last-name"
                      type="text"
                      placeholder="Doe"
                      className="w-full rounded-md border border-[#5A9A3D]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A9A3D]/20"
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
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-left block">Company Name</label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Your Company"
                    className="w-full rounded-md border border-[#5A9A3D]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A9A3D]/20"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full bg-[#F3B522] hover:bg-[#F3B522]/90 text-[#194D33] font-medium shadow-md">
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
      </main>

      <footer className="w-full py-8 bg-[#194D33] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Pickle</h3>
              <p className="text-sm text-white/80">
                The premier B2B marketplace for food industry professionals.
              </p>
              <div className="flex items-center mt-4 space-x-4">
                <a href="#" className="text-white hover:text-[#F3B522]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#F3B522]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#F3B522]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link href="/home" className="hover:text-[#F3B522]">Home</Link></li>
                <li><Link href="/marketplace" className="hover:text-[#F3B522]">Marketplace</Link></li>
                <li><Link href="/about" className="hover:text-[#F3B522]">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#F3B522]">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link href="/blog" className="hover:text-[#F3B522]">Blog</Link></li>
                <li><Link href="/faq" className="hover:text-[#F3B522]">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-[#F3B522]">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-[#F3B522]">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>123 Market Street</li>
                <li>San Francisco, CA 94105</li>
                <li>info@picklemarket.com</li>
                <li>(555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            <p>© {new Date().getFullYear()} Pickle B2B Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
