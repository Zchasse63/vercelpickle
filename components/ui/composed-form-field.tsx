import React from 'react';
import { createComposedComponent } from '@/lib/component-composition-factory';
import { withErrorMessage, withLabel } from '@/lib/composition-utils';

// Base components
const Label = ({ children, htmlFor, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
    data-testid="form-field-label"
    {...props}
  >
    {children}
  </label>
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
      error ? 'border-destructive' : ''
    } ${className || ''}`}
    data-testid="form-field-input"
    {...props}
  />
));

Input.displayName = 'Input';

const FormMessage = ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  if (!children) {
    return null;
  }

  return (
    <p
      className={`text-sm font-medium text-destructive ${className || ''}`}
      data-testid="form-field-message"
      {...props}
    >
      {children}
    </p>
  );
};

// Create enhanced components with composition utilities
const LabelWithFor = withLabel(Label, (props) => props.label, 'top');
const InputWithError = withErrorMessage(Input, (props) => props.error);

// Create a simpler form field component for testing
export const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    error?: string;
    name?: string;
    id?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    [key: string]: any;
  }
>(({ label, error, className, name, id, onChange, disabled, ...props }, ref) => {
  const inputId = id || name || 'input-field';

  return (
    <div ref={ref} className={`space-y-2 ${className || ''}`} data-testid="formfield-element">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        name={name}
        error={error}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
});

FormField.displayName = 'FormField';

// Export the form field props type
export type FormFieldProps = React.ComponentProps<typeof FormField>;

// Usage example:
// <FormField
//   name="email"
//   label="Email"
//   placeholder="Enter your email"
//   error={errors.email}
//   value={values.email}
//   onChange={handleChange}
// />
