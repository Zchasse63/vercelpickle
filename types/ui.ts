import { VariantProps } from "class-variance-authority";
import { HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { FieldValues, Path } from "react-hook-form";

/**
 * Form field props interface
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
 * Select option interface
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Form submission status type
 */
export type FormSubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Form error interface
 */
export interface FormError {
  field?: string;
  message: string;
}

/**
 * Form state interface
 */
export interface FormState {
  status: FormSubmissionStatus;
  errors: FormError[];
}

/**
 * Input props interface
 */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  helperText?: string;
  variant?: string;
  size?: string;
  state?: string;
}

/**
 * Textarea props interface
 */
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
  errorMessage?: string;
  helperText?: string;
  variant?: string;
  size?: string;
  state?: string;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

/**
 * Button props interface
 */
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  accessibleLabel?: string;
  variant?: string;
  size?: string;
  brand?: string;
}

/**
 * Badge props interface
 */
export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement> {
  variant?: string;
}

/**
 * Loading props interface
 */
export interface LoadingProps
  extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  textPosition?: "top" | "bottom" | "left" | "right";
  icon?: "spinner" | "circle" | "refresh" | "rotate";
  progress?: number;
  repeat?: number;
  fullPage?: boolean;
  variant?: string;
  size?: string;
  alignment?: string;
  color?: string;
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Pagination params interface
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Search params interface
 */
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
}

/**
 * Theme type
 */
export type Theme = "light" | "dark" | "system";
