"use client";

import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/ui/page-header';

export function AboutContent() {
  return (
    <main className="flex-1" data-testid="about-content">
      <PageHeader
        heading="About Pickle"
        subheading="The premier B2B marketplace for food industry professionals"
      />
      
      <Container className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Pickle was founded with a simple mission: to revolutionize how food industry businesses connect, 
              source products, and grow together. We're building the most efficient B2B marketplace 
              specifically designed for food industry professionals.
            </p>
            <p className="text-gray-700 mb-4">
              Our platform connects buyers directly with sellers, eliminating unnecessary middlemen 
              and creating a more transparent, efficient marketplace for everyone involved.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Pickle was born out of frustration with the status quo. Our founders, having worked in the 
              food industry for decades, experienced firsthand the inefficiencies and challenges of 
              traditional B2B sourcing and selling.
            </p>
            <p className="text-gray-700 mb-4">
              In 2023, we set out to build a better solution - a digital marketplace that would bring 
              the food industry into the modern era, making it easier for businesses to find reliable 
              suppliers and for producers to reach new customers.
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" data-testid="value-transparency">
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-gray-700">
                We believe in complete transparency in pricing, sourcing, and business practices.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" data-testid="value-quality">
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-700">
                We're committed to maintaining the highest standards for products on our platform.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" data-testid="value-community">
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-700">
                We're building more than a marketplace - we're creating a community of food industry professionals.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6">
            Pickle is powered by a diverse team of food industry veterans, technology experts, and 
            marketplace specialists who are passionate about transforming the B2B food industry.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300" data-testid="team-member-1">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold">Jane Doe</h3>
              <p className="text-sm text-gray-600">CEO & Co-Founder</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300" data-testid="team-member-2">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold">John Smith</h3>
              <p className="text-sm text-gray-600">CTO & Co-Founder</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300" data-testid="team-member-3">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold">Emily Johnson</h3>
              <p className="text-sm text-gray-600">Head of Operations</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300" data-testid="team-member-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold">Michael Chen</h3>
              <p className="text-sm text-gray-600">Lead Developer</p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
