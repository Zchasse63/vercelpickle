"use client"

import { useState } from "react"
import { z } from "zod"
import { 
  useZodForm, 
  Form, 
  FormInput, 
  FormCheckbox, 
  FormRow
} from "@/lib/forms/exports"
import { PaymentMethod } from "./payment-method-card"

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
  // Check format (MM/YY or MM/YYYY)
  if (!/^\d{2}\/\d{2}(\d{2})?$/.test(value)) {
    return false;
  }

  const parts = value.split('/');
  const month = parseInt(parts[0], 10);
  let year = parseInt(parts[1], 10);

  // Adjust year if it's in YY format
  if (year < 100) {
    year += 2000;
  }

  // Check if month is valid
  if (month < 1 || month > 12) {
    return false;
  }

  // Get current date
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed

  // Check if the card is not expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
};

// Format card number with spaces
const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

// Format expiry date
const formatExpiryDate = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  
  if (v.length >= 2) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  }
  
  return v;
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

export type PaymentFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  initialData?: Partial<PaymentFormData>
  onSubmit: (data: PaymentFormData) => void
  testId?: string
}

/**
 * PaymentMethodForm component
 * 
 * A form for adding or editing a payment method.
 */
export function PaymentMethodForm({
  initialData,
  onSubmit,
  testId,
}: PaymentMethodFormProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  
  // Create form with Zod validation
  const form = useZodForm(paymentMethodSchema, {
    defaultValues: {
      cardName: initialData?.cardName || "",
      cardNumber: initialData?.cardNumber || "",
      expiry: initialData?.expiry || "",
      cvc: initialData?.cvc || "",
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
  
  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit}
      status={formStatus}
      successMessage="Payment method added successfully!"
      errorMessage="Failed to add payment method. Please try again."
      testId={testId}
    >
      <div className="grid gap-4 py-4">
        <FormInput
          name="cardName"
          label="Name on Card"
          required
          placeholder="John Doe"
          autoComplete="cc-name"
          disabled={formStatus === 'submitting'}
          testId={`${testId}-card-name`}
        />
        
        <FormInput
          name="cardNumber"
          label="Card Number"
          required
          placeholder="4242 4242 4242 4242"
          autoComplete="cc-number"
          disabled={formStatus === 'submitting'}
          testId={`${testId}-card-number`}
          transform={{
            input: formatCardNumber,
            output: (value) => value.replace(/\s/g, '')
          }}
          maxLength={19}
        />
        
        <FormRow>
          <FormInput
            name="expiry"
            label="Expiry Date"
            required
            placeholder="MM/YY"
            autoComplete="cc-exp"
            disabled={formStatus === 'submitting'}
            testId={`${testId}-expiry`}
            transform={{
              input: formatExpiryDate
            }}
            maxLength={5}
          />
          
          <FormInput
            name="cvc"
            label="CVC"
            required
            placeholder="123"
            autoComplete="cc-csc"
            disabled={formStatus === 'submitting'}
            testId={`${testId}-cvc`}
            maxLength={4}
          />
        </FormRow>
        
        <FormCheckbox
          name="isDefault"
          label="Set as default payment method"
          disabled={formStatus === 'submitting'}
          testId={`${testId}-default`}
        />
      </div>
    </Form>
  )
}
