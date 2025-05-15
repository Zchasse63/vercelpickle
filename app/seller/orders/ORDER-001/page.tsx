import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Download, Printer, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const metadata: Metadata = {
  title: 'Order Details - Pickle B2B Marketplace',
  description: 'View and manage order details on Pickle B2B Marketplace.',
};

export default function OrderDetailsPage() {
  // This would typically come from your data fetching logic
  const order = {
    id: 'ORD-001',
    customer: {
      name: 'Acme Restaurant',
      email: 'orders@acmerestaurant.com',
      phone: '(555) 123-4567',
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'United States',
      },
    },
    date: new Date('2023-05-15'),
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    subtotal: 325.00,
    tax: 20.00,
    shipping: 0.00,
    total: 345.00,
    items: [
      {
        id: 'PROD-001',
        name: 'Organic Carrots (5lb)',
        quantity: 10,
        price: 4.99,
        total: 49.90,
      },
      {
        id: 'PROD-002',
        name: 'Fresh Milk (1 Gallon)',
        quantity: 15,
        price: 5.49,
        total: 82.35,
      },
      {
        id: 'PROD-003',
        name: 'Artisan Bread Loaf',
        quantity: 20,
        price: 3.99,
        total: 79.80,
      },
      {
        id: 'PROD-005',
        name: 'Russet Potatoes (10lb)',
        quantity: 12,
        price: 6.99,
        total: 83.88,
      },
      {
        id: 'PROD-007',
        name: 'Premium Coffee Beans (1lb)',
        quantity: 2,
        price: 14.99,
        total: 29.98,
      },
    ],
    notes: 'Please deliver to the back entrance. Call when arriving.',
    timeline: [
      {
        status: 'Order Placed',
        date: new Date('2023-05-15T09:30:00'),
        description: 'Order was placed by customer',
      },
      {
        status: 'Payment Confirmed',
        date: new Date('2023-05-15T09:35:00'),
        description: 'Payment was confirmed',
      },
      {
        status: 'Processing',
        date: new Date('2023-05-15T10:15:00'),
        description: 'Order is being processed',
      },
      {
        status: 'Packed',
        date: new Date('2023-05-15T14:20:00'),
        description: 'Order has been packed',
      },
      {
        status: 'Shipped',
        date: new Date('2023-05-16T09:10:00'),
        description: 'Order has been shipped',
      },
      {
        status: 'Delivered',
        date: new Date('2023-05-17T14:30:00'),
        description: 'Order has been delivered',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Order {order.id}</h1>
          <p className="text-muted-foreground">
            Placed on {format(order.date, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Status</p>
                <Badge className="mt-1">{order.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Payment Status</p>
                <Badge variant="outline" className="mt-1">
                  {order.paymentStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/images/avatars/01.png" alt={order.customer.name} />
                <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Order Items</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Items included in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Delivery address and shipping details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Shipping Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.address.street}<br />
                    {order.customer.address.city}, {order.customer.address.state} {order.customer.address.zip}<br />
                    {order.customer.address.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Shipping Method</h3>
                  <p className="text-sm text-muted-foreground">Standard Delivery</p>
                </div>
                <div>
                  <h3 className="font-medium">Tracking Information</h3>
                  <p className="text-sm text-muted-foreground">Tracking #: TRK123456789</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>
                History of order status changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative flex items-center justify-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="absolute top-8 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(event.date, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
              <CardDescription>
                Additional information about this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm">{order.notes}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
