"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { z } from "zod"

// Credit card validation helpers
const validateCardNumber = (value: string) => {
  // Remove spaces and non-numeric characters
  const cardNumber = value.replace(/\D/g, '');

  // Check if it's a valid length (most cards are 13-19 digits)
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return false;
  }

  // Luhn algorithm for card number validation
  let sum = 0;
  let shouldDouble = false;

  // Loop through the card number from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const validateExpiryDate = (value: string) => {
  // Check format (MM/YY)
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return false;
  }

  const [month, year] = value.split('/').map(part => parseInt(part, 10));

  // Check month is between 1-12
  if (month < 1 || month > 12) {
    return false;
  }

  // Get current date
  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Get last 2 digits of year
  const currentMonth = now.getMonth() + 1; // JS months are 0-indexed

  // Check if card is expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
};

// Define payment method schema for validation
const paymentMethodSchema = z.object({
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z.string()
    .min(13, "Card number is required")
    .refine(validateCardNumber, "Invalid card number"),
  expiry: z.string()
    .min(5, "Expiry date is required")
    .refine(validateExpiryDate, "Invalid expiry date"),
  cvc: z.string()
    .min(3, "CVC is required")
    .max(4, "CVC must be 3-4 digits")
    .regex(/^\d{3,4}$/, "CVC must be 3-4 digits"),
  isDefault: z.boolean().default(false)
});

type PaymentFormData = z.infer<typeof paymentMethodSchema>;

interface AddPaymentMethodProps {
  children: React.ReactNode
  onPaymentMethodAdded?: (paymentMethod: any) => void
}

export function BuyerAddPaymentMethod({ children, onPaymentMethodAdded }: AddPaymentMethodProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<PaymentFormData>>({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    isDefault: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (field: keyof PaymentFormData, value: string | boolean) => {
    // Format card number with spaces
    if (field === 'cardNumber' && typeof value === 'string') {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      // Add spaces every 4 digits
      const formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, '$1 ');
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    }
    // Format expiry date with slash
    else if (field === 'expiry' && typeof value === 'string') {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      // Add slash after first 2 digits
      let formattedValue = numericValue;
      if (numericValue.length >= 2) {
        formattedValue = `${numericValue.substring(0, 2)}/${numericValue.substring(2, 4)}`;
      }
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    }
    else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  const validateForm = (): boolean => {
    try {
      paymentMethodSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');

    // Validate the form
    if (!validateForm()) {
      // Show toast for validation errors
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call with potential network error
      await new Promise((resolve, reject) => {
        // Simulate successful API call 90% of the time
        const shouldSucceed = Math.random() < 0.9;

        setTimeout(() => {
          if (shouldSucceed) {
            resolve(true);
          } else {
            reject(new Error("Network error"));
          }
        }, 1000);
      });

      // Extract card details for the callback
      const cardNumber = formData.cardNumber?.replace(/\s/g, '') || '';
      const last4 = cardNumber.slice(-4);
      const [expMonth, expYear] = (formData.expiry?.split('/') || ['', '']).map(part => parseInt(part, 10));

      // Determine card brand based on first digit
      let brand = 'Unknown';
      if (cardNumber.startsWith('4')) brand = 'Visa';
      else if (cardNumber.startsWith('5')) brand = 'Mastercard';
      else if (cardNumber.startsWith('3')) brand = 'American Express';
      else if (cardNumber.startsWith('6')) brand = 'Discover';

      const paymentMethodData = {
        id: `pm_${Math.random().toString(36).substring(2, 15)}`,
        brand,
        last4,
        expMonth,
        expYear,
        isDefault: formData.isDefault
      };

      // Success handling
      setSubmitStatus('success');
      toast({
        title: "Payment method added successfully",
        description: "Your new payment method has been added.",
      });

      // Call the callback if provided
      if (onPaymentMethodAdded) {
        onPaymentMethodAdded(paymentMethodData);
      }

      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
        // Reset form
        setFormData({
          cardName: "",
          cardNumber: "",
          expiry: "",
          cvc: "",
          isDefault: false
        });
        setErrors({});
        setSubmitStatus('idle');
      }, 1500);
    } catch (error) {
      // Error handling
      setSubmitStatus('error');

      // Determine error message based on error type
      let errorMessage = "There was an error adding your payment method. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("Network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes("server")) {
          errorMessage = "Server error. Our team has been notified.";
        } else if (error.message.includes("card")) {
          errorMessage = "Your card was declined. Please try another payment method.";
        }
      }

      toast({
        title: "Failed to add payment method",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} data-testid="payment-form">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Enter your card details to add a new payment method.</DialogDescription>
          </DialogHeader>

          {submitStatus === 'success' && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Payment method added successfully!
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                Failed to add payment method. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cardName" className={errors.cardName ? "text-red-500" : ""}>Name on Card</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                autoComplete="cc-name"
                required
                data-testid="card-name-input"
                value={formData.cardName}
                onChange={(e) => handleChange('cardName', e.target.value)}
                className={errors.cardName ? "border-red-500" : ""}
              />
              {errors.cardName && (
                <p className="text-red-500 text-sm mt-1" data-testid="card-name-error">{errors.cardName}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cardNumber" className={errors.cardNumber ? "text-red-500" : ""}>Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                autoComplete="cc-number"
                required
                data-testid="card-number-input"
                value={formData.cardNumber}
                onChange={(e) => handleChange('cardNumber', e.target.value)}
                className={errors.cardNumber ? "border-red-500" : ""}
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1" data-testid="card-number-error">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry" className={errors.expiry ? "text-red-500" : ""}>Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  required
                  data-testid="card-expiry-input"
                  value={formData.expiry}
                  onChange={(e) => handleChange('expiry', e.target.value)}
                  className={errors.expiry ? "border-red-500" : ""}
                  maxLength={5}
                />
                {errors.expiry && (
                  <p className="text-red-500 text-sm mt-1" data-testid="card-expiry-error">{errors.expiry}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cvc" className={errors.cvc ? "text-red-500" : ""}>CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  autoComplete="cc-csc"
                  required
                  data-testid="card-cvc-input"
                  value={formData.cvc}
                  onChange={(e) => handleChange('cvc', e.target.value)}
                  className={errors.cvc ? "border-red-500" : ""}
                  maxLength={4}
                />
                {errors.cvc && (
                  <p className="text-red-500 text-sm mt-1" data-testid="card-cvc-error">{errors.cvc}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="defaultCard"
                checked={formData.isDefault}
                onCheckedChange={(checked) => handleChange('isDefault', Boolean(checked))}
                data-testid="payment-default-checkbox"
              />
              <Label htmlFor="defaultCard">Set as default payment method</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              data-testid="cancel-payment-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="save-payment-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
