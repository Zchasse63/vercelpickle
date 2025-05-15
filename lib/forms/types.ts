/**
 * Form Types
 * 
 * This module provides TypeScript types for form components.
 */

import { FieldValues, Path } from "react-hook-form";

/**
 * Form component props
 */
export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  testId?: string;
}

/**
 * Select option
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Form submission status
 */
export type FormSubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Form error
 */
export interface FormError {
  field?: string;
  message: string;
}

/**
 * Form state
 */
export interface FormState {
  status: FormSubmissionStatus;
  errors: FormError[];
}

/**
 * Address form data
 */
export interface AddressFormData {
  name: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

/**
 * Payment method form data
 */
export interface PaymentMethodFormData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  isDefault: boolean;
}

/**
 * Profile form data
 */
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
}
