"use client";

import { useState, useCallback } from "react";
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export function ContactContent() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "We've received your message and will get back to you shortly.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        subject: "",
        message: ""
      });
    }, 1500);
  }, [formData, toast]);

  return (
    <main className="flex-1" data-testid="contact-content">
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
            
            <form className="space-y-4" onSubmit={handleSubmit} data-testid="contact-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    required 
                    value={formData.firstName}
                    onChange={handleChange}
                    data-testid="first-name-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    required 
                    value={formData.lastName}
                    onChange={handleChange}
                    data-testid="last-name-input"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  data-testid="email-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input 
                  id="company" 
                  placeholder="Your Company" 
                  value={formData.company}
                  onChange={handleChange}
                  data-testid="company-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="How can we help?" 
                  required 
                  value={formData.subject}
                  onChange={handleChange}
                  data-testid="subject-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your inquiry..." 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  data-testid="message-input"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
                data-testid="submit-button"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-6">
              You can also reach us using the information below.
            </p>
            
            <div className="space-y-6">
              <Card className="hover:shadow-md transition-shadow duration-300" data-testid="general-inquiries">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">General Inquiries</h3>
                  <p className="text-gray-700">info@picklemarket.com</p>
                  <p className="text-gray-700">+1 (555) 123-4567</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow duration-300" data-testid="support">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Support</h3>
                  <p className="text-gray-700">support@picklemarket.com</p>
                  <p className="text-gray-700">+1 (555) 987-6543</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow duration-300" data-testid="business-development">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Business Development</h3>
                  <p className="text-gray-700">partnerships@picklemarket.com</p>
                  <p className="text-gray-700">+1 (555) 456-7890</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow duration-300" data-testid="office-location">
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
