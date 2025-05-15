"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { 
  useZodForm, 
  Form, 
  FormInput, 
  FormCheckbox, 
  FormSelect, 
  FormPhoneInput,
  FormRow
} from "@/lib/forms/exports"
import { Address } from "./address-card"

// Define address schema for validation
const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  street: z.string().min(3, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string()
    .min(5, "ZIP code is required")
    .refine(
      (val) => /^\d{5}(-\d{4})?$/.test(val) || /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(val),
      "Invalid ZIP/postal code format"
    ),
  country: z.string().min(2, "Country is required"),
  phone: z.string()
    .min(10, "Phone number is required")
    .refine(
      (val) => /^\(\d{3}\) \d{3}-\d{4}$/.test(val),
      "Invalid phone number format"
    ),
  isDefault: z.boolean().default(false)
});

export type AddressFormData = z.infer<typeof addressSchema>;

// Country options
const countryOptions = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "MX", label: "Mexico" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
];

// US state options
const usStateOptions = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

// Canadian province options
const canadianProvinceOptions = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

interface AddressFormProps {
  initialData?: Partial<AddressFormData>
  onSubmit: (data: AddressFormData) => void
  isEditing?: boolean
  testId?: string
}

/**
 * AddressForm component
 * 
 * A form for adding or editing an address.
 */
export function AddressForm({
  initialData,
  onSubmit,
  isEditing = false,
  testId,
}: AddressFormProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [selectedCountry, setSelectedCountry] = useState(initialData?.country || "US")
  
  // Get state options based on selected country
  const stateOptions = selectedCountry === "CA" ? canadianProvinceOptions : usStateOptions
  
  // Create form with Zod validation
  const form = useZodForm(addressSchema, {
    defaultValues: {
      name: initialData?.name || "",
      street: initialData?.street || "",
      street2: initialData?.street2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zip: initialData?.zip || "",
      country: initialData?.country || "US",
      phone: initialData?.phone || "",
      isDefault: initialData?.isDefault || false,
    },
    onSubmit: async (data) => {
      setFormStatus('submitting')
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Call the onSubmit callback
        onSubmit(data)
        
        // Success handling
        setFormStatus('success')
      } catch (error) {
        // Error handling
        setFormStatus('error')
      }
    }
  })
  
  // Update state options when country changes
  useEffect(() => {
    const country = form.watch("country")
    setSelectedCountry(country)
  }, [form.watch("country")])
  
  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit}
      status={formStatus}
      successMessage={isEditing ? "Address updated successfully!" : "Address added successfully!"}
      errorMessage={isEditing ? "Failed to update address. Please try again." : "Failed to add address. Please try again."}
      testId={testId}
    >
      <div className="grid gap-4 py-4">
        <FormInput
          name="name"
          label="Full Name"
          required
          placeholder="John Doe"
          autoComplete="name"
          disabled={formStatus === 'submitting'}
          testId={`${testId}-name`}
        />
        
        <FormInput
          name="street"
          label="Street Address"
          required
          placeholder="123 Main St"
          autoComplete="address-line1"
          disabled={formStatus === 'submitting'}
          testId={`${testId}-street`}
        />
        
        <FormInput
          name="street2"
          label="Apartment, suite, etc. (optional)"
          placeholder="Apt 4B"
          autoComplete="address-line2"
          disabled={formStatus === 'submitting'}
          testId={`${testId}-street2`}
        />
        
        <FormRow>
          <FormInput
            name="city"
            label="City"
            required
            placeholder="San Francisco"
            autoComplete="address-level2"
            disabled={formStatus === 'submitting'}
            testId={`${testId}-city`}
          />
          
          <FormSelect
            name="state"
            label="State / Province"
            required
            options={stateOptions}
            disabled={formStatus === 'submitting'}
            testId={`${testId}-state`}
          />
        </FormRow>
        
        <FormRow>
          <FormInput
            name="zip"
            label="ZIP / Postal Code"
            required
            placeholder={selectedCountry === "CA" ? "A1A 1A1" : "12345"}
            autoComplete="postal-code"
            disabled={formStatus === 'submitting'}
            testId={`${testId}-zip`}
          />
          
          <FormSelect
            name="country"
            label="Country"
            required
            options={countryOptions}
            disabled={formStatus === 'submitting'}
            testId={`${testId}-country`}
          />
        </FormRow>
        
        <FormPhoneInput
          name="phone"
          label="Phone Number"
          required
          placeholder="(555) 123-4567"
          autoComplete="tel"
          disabled={formStatus === 'submitting'}
          testId={`${testId}-phone`}
        />
        
        <FormCheckbox
          name="isDefault"
          label="Set as default shipping address"
          disabled={formStatus === 'submitting'}
          testId={`${testId}-default`}
        />
      </div>
    </Form>
  )
}
