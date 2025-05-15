import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contact Us - Pickle B2B Marketplace',
  description: 'Get in touch with the Pickle team for support, partnerships, or general inquiries.',
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <PageHeader
        heading="Contact Us"
        subheading="Get in touch with our team"
      />
      
      <Container className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-700 mb-6">
              Have questions about Pickle? Want to join our platform as a buyer or seller?
              We'd love to hear from you. Fill out the form and our team will get back to you shortly.
            </p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="John" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Doe" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your Company" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your inquiry..." 
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-6">
              You can also reach us using the information below.
            </p>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">General Inquiries</h3>
                  <p className="text-gray-700">info@picklemarket.com</p>
                  <p className="text-gray-700">+1 (555) 123-4567</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Support</h3>
                  <p className="text-gray-700">support@picklemarket.com</p>
                  <p className="text-gray-700">+1 (555) 987-6543</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Business Development</h3>
                  <p className="text-gray-700">partnerships@picklemarket.com</p>
                  <p className="text-gray-700">+1 (555) 456-7890</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Office Location</h3>
                  <p className="text-gray-700">
                    123 Market Street<br />
                    Suite 400<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
