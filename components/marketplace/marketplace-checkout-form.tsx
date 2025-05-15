"use client"

import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CreditCard, CheckCircle2, Truck, ShieldCheck, ChevronsRight } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { Loading } from "@/components/ui/loading"
import { Card, CardContent } from "@/components/ui/card"

export function MarketplaceCheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment' | 'review'>('shipping');

  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const { cartItems, cartTotals, emptyCart } = useCart(user?.id || null);

  // Get the create order mutation
  const createOrder = useMutation(api.orders.create);

  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle next step in checkout process
  const handleNextStep = () => {
    if (checkoutStep === 'shipping') {
      // Validate shipping information
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
          !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast({
          title: "Missing information",
          description: "Please fill in all required shipping fields",
          variant: "destructive",
        });
        return;
      }
      setCheckoutStep('payment');
    } else if (checkoutStep === 'payment') {
      // Validate payment information
      if (paymentMethod === 'credit-card' &&
          (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvc)) {
        toast({
          title: "Missing payment information",
          description: "Please fill in all required payment fields",
          variant: "destructive",
        });
        return;
      }
      setCheckoutStep('review');
    }
  };

  // Handle previous step in checkout process
  const handlePreviousStep = () => {
    if (checkoutStep === 'payment') {
      setCheckoutStep('shipping');
    } else if (checkoutStep === 'review') {
      setCheckoutStep('payment');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checkoutStep !== 'review') {
      handleNextStep();
      return;
    }

    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      router.push("/marketplace");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order items from cart items
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      // Get seller ID from the first product (simplified for demo)
      const sellerId = cartItems[0].product?.sellerId;

      if (!sellerId) {
        throw new Error("Invalid seller information");
      }

      // Create the order
      const orderId = await createOrder({
        buyerId: user.id as any,
        sellerId: sellerId as any,
        items: orderItems.map(item => ({
          productId: item.productId as any,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: cartTotals.subtotal,
        tax: cartTotals.tax,
        shipping: cartTotals.shipping,
        total: cartTotals.total,
        status: "pending",
        paymentStatus: "paid", // Simplified for demo
        paymentMethod,
        shippingAddress: {
          street: `${formData.address} ${formData.apartment}`.trim(),
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        billingAddress: {
          street: `${formData.address} ${formData.apartment}`.trim(),
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        notes: formData.notes,
      });

      // Clear the cart
      await emptyCart();

      // Show success message
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully",
      });

      // Redirect to order confirmation page
      router.push(`/marketplace/orders/${orderId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the component
  return (
    <form onSubmit={handleSubmit} className="space-y-8" data-testid="checkout-form">
      {/* Checkout Progress */}
      <div className="mb-8" data-testid="checkout-progress">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-dill-green">Checkout</h2>
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/marketplace/auth/login" className="text-dill-green hover:underline" data-testid="login-link">
              Log in
            </Link>
          </div>
        </div>

        <div className="relative flex justify-between">
          <div className={`flex flex-col items-center ${checkoutStep === 'shipping' ? 'text-dill-green font-medium' : 'text-muted-foreground'}`} data-testid="step-shipping">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${checkoutStep === 'shipping' ? 'bg-dill-green text-white' : 'bg-muted border border-muted-foreground/30'}`}>
              1
            </div>
            <span className="text-sm">Shipping</span>
          </div>

          <div className={`flex flex-col items-center ${checkoutStep === 'payment' ? 'text-dill-green font-medium' : 'text-muted-foreground'}`} data-testid="step-payment">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${checkoutStep === 'payment' ? 'bg-dill-green text-white' : 'bg-muted border border-muted-foreground/30'}`}>
              2
            </div>
            <span className="text-sm">Payment</span>
          </div>

          <div className={`flex flex-col items-center ${checkoutStep === 'review' ? 'text-dill-green font-medium' : 'text-muted-foreground'}`} data-testid="step-review">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${checkoutStep === 'review' ? 'bg-dill-green text-white' : 'bg-muted border border-muted-foreground/30'}`}>
              3
            </div>
            <span className="text-sm">Review</span>
          </div>

          {/* Progress line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-10" data-testid="progress-line">
            <div
              className="h-full bg-dill-green transition-all duration-300"
              style={{
                width: checkoutStep === 'shipping' ? '0%' :
                       checkoutStep === 'payment' ? '50%' : '100%'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Shipping Step */}
      {checkoutStep === 'shipping' && (
      <div className="space-y-4" data-testid="shipping-step">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Contact Information</h2>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              autoComplete="email"
              required
              data-testid="email-input"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              autoComplete="tel"
              required
              data-testid="phone-input"
            />
          </div>
        </div>
      </div>
      )}

      {/* Payment Step */}
      {checkoutStep === 'payment' && (
      <div className="space-y-6" data-testid="payment-step">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Method</h2>
          <RadioGroup defaultValue="credit-card" value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4" data-testid="payment-method-group">
            <div className={`rounded-md border p-4 ${paymentMethod === 'credit-card' ? 'border-dill-green bg-dill-green/5' : 'hover:border-dill-green/50'} transition-colors`} data-testid="credit-card-option">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="credit-card" id="credit-card" className="mt-1" />
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-dill-green" />
                    <Label htmlFor="credit-card" className="font-medium">Credit Card</Label>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
      )}

      {/* Review Step */}
      {checkoutStep === 'review' && (
      <div className="space-y-6" data-testid="review-step">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Order Review</h2>

          <Card className="border border-dill-green/20" data-testid="shipping-review">
            <CardContent className="p-6 space-y-6">
              {/* Shipping Information */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-dill-green">Shipping Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-dill-green hover:text-dill-green/80"
                    onClick={() => setCheckoutStep('shipping')}
                    data-testid="edit-shipping-button"
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-sm space-y-1 text-muted-foreground" data-testid="shipping-details">
                  <p className="font-medium text-foreground">{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address} {formData.apartment}</p>
                  <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                  <p>{formData.country}</p>
                  <p>{formData.phone}</p>
                  <p>{formData.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-dill-green/5 rounded-lg p-4 mt-6 border border-dill-green/20" data-testid="terms-agreement">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-5 w-5 text-dill-green" />
              <p>By placing your order, you agree to our <Link href="/terms" className="text-dill-green hover:underline" data-testid="terms-link">Terms of Service</Link> and <Link href="/privacy" className="text-dill-green hover:underline" data-testid="privacy-link">Privacy Policy</Link>.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6" data-testid="review-actions">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handlePreviousStep}
            data-testid="back-button"
          >
            Back to Payment
          </Button>
          <Button
            type="submit"
            size="lg"
            className="bg-mustard hover:bg-mustard/90"
            disabled={isSubmitting}
            data-testid="place-order-button"
          >
            {isSubmitting ? (
              <Loading size="sm" />
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </div>
      )}
    </form>
  );
}
