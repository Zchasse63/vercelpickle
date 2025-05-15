import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Clock, Shield, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Organic Carrots (5lb) - Pickle B2B Marketplace',
  description: 'Fresh organic carrots from local farms - Pickle B2B Marketplace.',
};

export default function ProductDetailPage() {
  // This would typically come from your data fetching logic
  const product = {
    id: 'PROD-001',
    name: 'Organic Carrots (5lb)',
    description: 'Fresh organic carrots from local farms. Our carrots are grown using sustainable farming practices and harvested at peak freshness. Perfect for restaurants, cafes, and food service businesses looking for high-quality produce.',
    price: 4.99,
    unit: 'bag',
    category: 'Vegetables',
    subcategory: 'Root Vegetables',
    inventory: 120,
    minOrderQuantity: 5,
    maxOrderQuantity: 100,
    images: [
      '/bunch-of-carrots.png',
      '/carrots-in-field.png',
      '/sliced-carrots.png',
      '/carrot-harvest.png',
    ],
    rating: 4.8,
    reviewCount: 156,
    seller: {
      id: 'SELLER-001',
      name: 'Farm Fresh Produce',
      location: 'Farmville, CA',
      rating: 4.9,
      reviewCount: 342,
      joinedDate: new Date('2021-03-15'),
    },
    specifications: [
      { name: 'Origin', value: 'California, USA' },
      { name: 'Organic', value: 'Yes' },
      { name: 'Freshness', value: 'Harvested within 48 hours' },
      { name: 'Storage', value: 'Refrigerate at 32-40°F' },
      { name: 'Shelf Life', value: '14-21 days when refrigerated' },
    ],
    nutritionalInfo: {
      servingSize: '100g',
      calories: 41,
      fat: '0.2g',
      carbs: '9.6g',
      protein: '0.9g',
      fiber: '2.8g',
      sugar: '4.7g',
    },
    shippingInfo: {
      methods: ['Standard Delivery', 'Express Delivery', 'Pickup Available'],
      estimatedDelivery: '1-3 business days',
      freeShippingThreshold: 100,
    },
    relatedProducts: [
      { id: 'PROD-004', name: 'Organic Spinach (1lb)', price: 3.49, image: '/fresh-spinach.png' },
      { id: 'PROD-005', name: 'Russet Potatoes (10lb)', price: 6.99, image: '/pile-of-potatoes.png' },
      { id: 'PROD-008', name: 'Organic Beets (3lb)', price: 4.29, image: '/fresh-beets.png' },
    ],
  };

  return (
    <main className="container mx-auto px-4 py-8" data-testid="product-details" data-testid="product-detail">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="product-name" data-cy="product-name">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="outline">{product.category}</Badge>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold" data-testid="product-price" data-cy="product-price">${product.price.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">per {product.unit}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                data-testid="product-image"
                data-cy="product-image"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(1, 4).map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground" data-testid="product-description" data-cy="product-description">{product.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableBody>
                      {product.specifications.map((spec, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{spec.name}</TableCell>
                          <TableCell>{spec.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="nutrition" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-2 font-medium">Nutritional Information (per {product.nutritionalInfo.servingSize})</p>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Calories</TableCell>
                        <TableCell>{product.nutritionalInfo.calories}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Fat</TableCell>
                        <TableCell>{product.nutritionalInfo.fat}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Carbohydrates</TableCell>
                        <TableCell>{product.nutritionalInfo.carbs}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Protein</TableCell>
                        <TableCell>{product.nutritionalInfo.protein}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Fiber</TableCell>
                        <TableCell>{product.nutritionalInfo.fiber}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sugar</TableCell>
                        <TableCell>{product.nutritionalInfo.sugar}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Shipping Methods</p>
                      <ul className="mt-2 space-y-1">
                        {product.shippingInfo.methods.map((method, index) => (
                          <li key={index} className="flex items-center">
                            <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{method}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Estimated Delivery</p>
                      <div className="mt-2 flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{product.shippingInfo.estimatedDelivery}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <div className="mt-2 flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Free shipping on orders over ${product.shippingInfo.freeShippingThreshold}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {product.relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{relatedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">${relatedProduct.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="font-medium">Quantity</p>
                  <div className="mt-2 flex items-center">
                    <Button variant="outline" size="icon">-</Button>
                    <Input
                      type="number"
                      min={product.minOrderQuantity}
                      max={product.maxOrderQuantity}
                      defaultValue={product.minOrderQuantity}
                      className="mx-2 w-20 text-center"
                    />
                    <Button variant="outline" size="icon">+</Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Min: {product.minOrderQuantity} | Max: {product.maxOrderQuantity}
                  </p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" data-testid="add-to-cart-button" data-cy="add-to-cart-button">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">
                      <Heart className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1">In Stock</Badge>
                    <span className="text-sm text-muted-foreground">{product.inventory} available</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-medium">Seller Information</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/images/avatars/02.png" alt={product.seller.name} />
                      <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{product.seller.name}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-xs">{product.seller.rating} ({product.seller.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Located in {product.seller.location}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    View Seller Profile
                  </Button>
                </div>

                <Separator />

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="bulk-pricing">
                    <AccordionTrigger>Bulk Pricing</AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>5-24</TableCell>
                            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>25-49</TableCell>
                            <TableCell className="text-right">${(product.price * 0.95).toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>50+</TableCell>
                            <TableCell className="text-right">${(product.price * 0.9).toFixed(2)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="return-policy">
                    <AccordionTrigger>Return Policy</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        We accept returns within 24 hours of delivery if the product doesn't meet our quality standards. Please contact the seller directly to arrange a return or replacement.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="payment-options">
                    <AccordionTrigger>Payment Options</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        We accept credit cards, ACH transfers, and net-30 terms for qualified businesses. Contact us for more information about payment options.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
