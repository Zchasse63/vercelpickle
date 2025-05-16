"use client";

import { useCallback, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useRouter } from "next/navigation";

export function CartContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { items, updateItemQuantity, removeItem, clearCart } = useCart(user?.id || null);
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 100 ? 0 : 15.00; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const handleQuantityChange = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 100) {
      updateItemQuantity(itemId, newQuantity);
    }
  }, [updateItemQuantity]);

  const handleRemoveItem = useCallback((itemId: string) => {
    removeItem(itemId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  }, [removeItem, toast]);

  const handleApplyPromo = useCallback(() => {
    setIsApplyingPromo(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false);
      if (promoCode.toLowerCase() === "pickle10") {
        toast({
          title: "Promo code applied",
          description: "You've received a 10% discount!",
        });
      } else {
        toast({
          title: "Invalid promo code",
          description: "The promo code you entered is invalid or expired",
          variant: "destructive",
        });
      }
    }, 1000);
  }, [promoCode, toast]);

  const handleCheckout = useCallback(() => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before proceeding to checkout",
        variant: "destructive",
      });
      return;
    }
    
    router.push("/checkout");
  }, [items.length, router, toast]);

  return (
    <main className="flex-1" data-testid="cart-content">
      <PageHeader
        heading="Shopping Cart"
        subheading="Review and manage your items"
      />
      
      <Container className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Cart Items</h2>
            
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} data-testid={`cart-item-${item.id}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-md flex-shrink-0"></div>
                        
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-gray-600">Seller: {item.seller || "Unknown Seller"}</p>
                              <p className="text-sm text-gray-600">Unit: {item.unit || "each"}</p>
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
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                data-testid={`decrease-quantity-${item.id}`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              
                              <span className="w-8 text-center" data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                              
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                data-testid={`increase-quantity-${item.id}`}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => handleRemoveItem(item.id)}
                              data-testid={`remove-item-${item.id}`}
                            >
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
                  <Button onClick={() => router.push("/marketplace")} data-testid="continue-shopping">
                    Continue Shopping
                  </Button>
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
                    <span data-testid="subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span data-testid="tax">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span data-testid="shipping">${shipping.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span data-testid="total">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleCheckout}
                      data-testid="checkout-button"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Promo Code</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  data-testid="promo-code-input"
                />
                <Button 
                  variant="outline"
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo || !promoCode}
                  data-testid="apply-promo-button"
                >
                  {isApplyingPromo ? "Applying..." : "Apply"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
