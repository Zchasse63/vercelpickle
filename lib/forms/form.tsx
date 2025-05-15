/**
 * Form Component
 * 
 * This module provides a Form component that integrates with React Hook Form.
 */

import React from "react";
import { FormProvider, UseFormReturn, FieldValues, SubmitHandler } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { FormSubmissionStatus } from "./types";

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
  status?: FormSubmissionStatus;
  successMessage?: string;
  errorMessage?: string;
  testId?: string;
}

/**
 * Form component
 */
export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  status = "idle",
  successMessage = "Form submitted successfully!",
  errorMessage = "There was an error submitting the form. Please try again.",
  testId,
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={className}
        data-testid={testId || "form"}
      >
        {status === "success" && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {status === "error" && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {children}
      </form>
    </FormProvider>
  );
}

/**
 * Form section component
 */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * Form row component for horizontal layout
 */
export function FormRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
}
