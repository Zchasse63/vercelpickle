import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shopping Cart - Pickle B2B Marketplace',
  description: 'View and manage your shopping cart on Pickle B2B Marketplace.',
};

export default function CartPage() {
  // This would normally come from a database or state management
  const cartItems = [
    {
      id: '1',
      name: 'Organic Apples',
      price: 24.99,
      quantity: 2,
      unit: 'case',
      image: '/placeholder-product.jpg',
      seller: 'Fresh Farms Co.'
    },
    {
      id: '2',
      name: 'Artisan Sourdough Bread',
      price: 5.99,
      quantity: 5,
      unit: 'loaf',
      image: '/placeholder-product.jpg',
      seller: 'Artisan Bakery'
    },
    {
      id: '3',
      name: 'Premium Olive Oil',
      price: 18.50,
      quantity: 1,
      unit: 'bottle',
      image: '/placeholder-product.jpg',
      seller: 'Mediterranean Imports'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = 15.00;
  const total = subtotal + tax + shipping;

  return (
    <main className="flex-1">
      <PageHeader
        heading="Shopping Cart"
        subheading="Review and manage your items"
      />
      
      <Container className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Cart Items</h2>
            
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-md flex-shrink-0"></div>
                        
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-gray-600">Seller: {item.seller}</p>
                              <p className="text-sm text-gray-600">Unit: {item.unit}</p>
                            </div>
                            
                            <div className="mt-2 sm:mt-0 text-right">
                              <p className="font-semibold">${item.price.toFixed(2)}</p>
                              <p className="text-sm text-gray-600">
                                Subtotal: ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Minus className="h-4 w-4" />
                              </Button>
                              
                              <span className="w-8 text-center">{item.quantity}</span>
                              
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button>Continue Shopping</Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Promo Code</h3>
              <div className="flex gap-2">
                <Input placeholder="Enter code" />
                <Button variant="outline">Apply</Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
