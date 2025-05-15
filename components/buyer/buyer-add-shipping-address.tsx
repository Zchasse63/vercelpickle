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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { z } from "zod"

// Phone number validation helper
const validatePhoneNumber = (value: string) => {
  // Remove non-numeric characters for validation
  const numericValue = value.replace(/\D/g, '');
  // Check if it's a valid length (most US numbers are 10 digits)
  return numericValue.length >= 10;
};

// ZIP code validation helper
const validateZipCode = (value: string) => {
  // US ZIP code pattern (5 digits or 5+4)
  const usZipPattern = /^\d{5}(-\d{4})?$/;
  // Canadian postal code pattern (A1A 1A1)
  const caPostalPattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

  return usZipPattern.test(value) || caPostalPattern.test(value);
};

// Define address schema for validation
const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  street: z.string().min(3, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string()
    .min(5, "ZIP code is required")
    .refine(validateZipCode, "Invalid ZIP/postal code format"),
  country: z.string().min(2, "Country is required"),
  phone: z.string()
    .min(10, "Phone number is required")
    .refine(validatePhoneNumber, "Invalid phone number format"),
  isDefault: z.boolean().default(false)
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddShippingAddressProps {
  children: React.ReactNode
  onAddressAdded?: (address: AddressFormData) => void
}

export function BuyerAddShippingAddress({ children, onAddressAdded }: AddShippingAddressProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<AddressFormData>>({
    name: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    phone: "",
    isDefault: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    // Format phone number
    if (field === 'phone' && typeof value === 'string') {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, '');

      // Format phone number as (XXX) XXX-XXXX
      let formattedValue = numericValue;
      if (numericValue.length > 0) {
        formattedValue = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      }

      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    }
    // Format ZIP code
    else if (field === 'zip' && typeof value === 'string') {
      // For US ZIP codes, limit to 10 characters (XXXXX-XXXX)
      if (formData.country === 'US') {
        const formatted = value.replace(/[^\d-]/g, '').substring(0, 10);
        setFormData(prev => ({ ...prev, [field]: formatted }));
      }
      // For Canadian postal codes, format as ANA NAN
      else if (formData.country === 'CA' && typeof value === 'string') {
        // Convert to uppercase and limit to 7 characters
        let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
        // Add space after the 3rd character
        if (formatted.length > 3) {
          formatted = formatted.substring(0, 3) + ' ' + formatted.substring(3);
        }
        setFormData(prev => ({ ...prev, [field]: formatted }));
      }
      else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
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
      addressSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')

    // Validate the form
    if (!validateForm()) {
      // Show toast for validation errors
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

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

      // Success handling
      setSubmitStatus('success')
      toast({
        title: "Address added successfully",
        description: "Your new shipping address has been added.",
      })

      // Call the callback if provided
      if (onAddressAdded) {
        onAddressAdded(formData as AddressFormData)
      }

      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false)
        // Reset form
        setFormData({
          name: "",
          street: "",
          street2: "",
          city: "",
          state: "",
          zip: "",
          country: "US",
          phone: "",
          isDefault: false
        })
        setErrors({})
        setSubmitStatus('idle')
      }, 1500)
    } catch (error) {
      // Error handling
      setSubmitStatus('error')

      // Determine error message based on error type
      let errorMessage = "There was an error adding your address. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("Network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes("server")) {
          errorMessage = "Server error. Our team has been notified.";
        }
      }

      toast({
        title: "Failed to add address",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit} data-testid="address-form">
          <DialogHeader>
            <DialogTitle>Add Shipping Address</DialogTitle>
            <DialogDescription>Enter your shipping address details.</DialogDescription>
          </DialogHeader>

          {submitStatus === 'success' && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Address added successfully!
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                Failed to add address. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                autoComplete="name"
                required
                data-testid="address-name-input"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1" data-testid="name-error">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="street" className={errors.street ? "text-red-500" : ""}>Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main St"
                autoComplete="address-line1"
                required
                data-testid="address-street-input"
                value={formData.street}
                onChange={(e) => handleChange('street', e.target.value)}
                className={errors.street ? "border-red-500" : ""}
              />
              {errors.street && (
                <p className="text-red-500 text-sm mt-1" data-testid="street-error">{errors.street}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="street2">Apartment, suite, etc. (optional)</Label>
              <Input
                id="street2"
                placeholder="Apt 4B"
                autoComplete="address-line2"
                value={formData.street2}
                onChange={(e) => handleChange('street2', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city" className={errors.city ? "text-red-500" : ""}>City</Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  autoComplete="address-level2"
                  required
                  data-testid="address-city-input"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1" data-testid="city-error">{errors.city}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="state" className={errors.state ? "text-red-500" : ""}>State / Province</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleChange('state', value)}
                >
                  <SelectTrigger
                    id="state"
                    data-testid="address-state-input"
                    className={errors.state ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="CO">Colorado</SelectItem>
                    <SelectItem value="CT">Connecticut</SelectItem>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="HI">Hawaii</SelectItem>
                    <SelectItem value="ID">Idaho</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1" data-testid="state-error">{errors.state}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="zip" className={errors.zip ? "text-red-500" : ""}>ZIP / Postal Code</Label>
                <Input
                  id="zip"
                  placeholder="94105"
                  autoComplete="postal-code"
                  required
                  data-testid="address-zip-input"
                  value={formData.zip}
                  onChange={(e) => handleChange('zip', e.target.value)}
                  className={errors.zip ? "border-red-500" : ""}
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm mt-1" data-testid="zip-error">{errors.zip}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country" className={errors.country ? "text-red-500" : ""}>Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleChange('country', value)}
                  defaultValue="US"
                >
                  <SelectTrigger
                    id="country"
                    data-testid="address-country-input"
                    className={errors.country ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1" data-testid="country-error">{errors.country}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone" className={errors.phone ? "text-red-500" : ""}>Phone Number</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                autoComplete="tel"
                required
                data-testid="address-phone-input"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1" data-testid="phone-error">{errors.phone}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="defaultAddress"
                checked={formData.isDefault}
                onCheckedChange={(checked) => handleChange('isDefault', Boolean(checked))}
                data-testid="address-default-checkbox"
              />
              <Label htmlFor="defaultAddress">Set as default shipping address</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              data-testid="cancel-address-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="save-address-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Address'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
