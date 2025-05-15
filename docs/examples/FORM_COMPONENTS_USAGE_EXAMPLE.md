# Form Components Usage Examples

**Last Updated:** `2025-05-06`

This document provides examples of how to use the enhanced form components in the Pickle B2B Marketplace platform.

## Table of Contents

1. [Form Components Overview](#form-components-overview)
2. [Using with React Hook Form](#using-with-react-hook-form)
3. [Using Standalone Components](#using-standalone-components)
4. [Variants and Sizes](#variants-and-sizes)
5. [Error States and Validation](#error-states-and-validation)
6. [Accessibility Features](#accessibility-features)
7. [Best Practices](#best-practices)

## Form Components Overview

The Pickle B2B Marketplace platform includes the following enhanced form components:

- **Input**: Text input field with variants, sizes, icons, and error handling
- **Textarea**: Multi-line text input with variants, sizes, and error handling
- **Select**: Dropdown selection with variants, sizes, and error handling
- **Checkbox**: Binary selection with variants, sizes, and error handling
- **RadioGroup**: Mutually exclusive options with variants, sizes, and error handling
- **Switch**: Toggle component with variants, sizes, and error handling

Each component is available in two versions:
- **Form*** components (e.g., `FormSelect`) - Integrated with React Hook Form
- **Standalone*** components (e.g., `StandaloneSelect`) - For use without React Hook Form

## Using with React Hook Form

Here's an example of a complete form using React Hook Form:

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input"
import { FormTextarea } from "@/components/ui/form-textarea"
import { FormSelect } from "@/components/ui/form-select"
import { FormCheckbox } from "@/components/ui/form-checkbox"
import { FormRadioGroup } from "@/components/ui/form-radio-group"
import { FormSwitch } from "@/components/ui/form-switch"

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  subscribe: z.boolean(),
  contactPreference: z.enum(["email", "phone", "mail"]),
  notifications: z.boolean(),
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      category: "",
      subscribe: false,
      contactPreference: "email",
      notifications: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          name="name"
          label="Name"
          placeholder="Enter your name"
          description="Your full name as it appears on your ID"
          size="md"
        />
        
        <FormInput
          name="email"
          label="Email"
          placeholder="Enter your email"
          description="We'll never share your email with anyone else"
          size="md"
        />
        
        <FormSelect
          name="category"
          label="Category"
          placeholder="Select a category"
          options={[
            { value: "support", label: "Support" },
            { value: "sales", label: "Sales" },
            { value: "billing", label: "Billing" },
          ]}
          description="Select the category that best matches your inquiry"
          variant="filled"
        />
        
        <FormRadioGroup
          name="contactPreference"
          label="Preferred Contact Method"
          options={[
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone" },
            { value: "mail", label: "Mail" },
          ]}
          description="How would you like us to contact you?"
        />
        
        <FormTextarea
          name="message"
          label="Message"
          placeholder="Enter your message"
          description="Please be as specific as possible"
          size="md"
          resize="vertical"
        />
        
        <FormCheckbox
          name="subscribe"
          label="Subscribe to newsletter"
          description="Receive updates about our products and services"
        />
        
        <FormSwitch
          name="notifications"
          label="Enable notifications"
          description="Receive notifications about your account"
          size="md"
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Using Standalone Components

Here's an example using the standalone components without React Hook Form:

```tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StandaloneInput } from "@/components/ui/form-input"
import { StandaloneTextarea } from "@/components/ui/form-textarea"
import { StandaloneSelect } from "@/components/ui/form-select"
import { StandaloneCheckbox } from "@/components/ui/form-checkbox"
import { StandaloneRadioGroup } from "@/components/ui/form-radio-group"
import { StandaloneSwitch } from "@/components/ui/form-switch"

export function ContactFormStandalone() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    category: "",
    subscribe: false,
    contactPreference: "email",
    notifications: false,
  })
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
    category: "",
  })
  
  function validateForm() {
    const newErrors = {
      name: formData.name.length < 2 ? "Name must be at least 2 characters" : "",
      email: !formData.email.includes('@') ? "Please enter a valid email" : "",
      message: formData.message.length < 10 ? "Message must be at least 10 characters" : "",
      category: !formData.category ? "Please select a category" : "",
    }
    
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }
  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validateForm()) {
      console.log(formData)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StandaloneInput
        label="Name"
        placeholder="Enter your name"
        helperText="Your full name as it appears on your ID"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        isError={!!errors.name}
        errorMessage={errors.name}
        size="md"
      />
      
      <StandaloneInput
        label="Email"
        placeholder="Enter your email"
        helperText="We'll never share your email with anyone else"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        isError={!!errors.email}
        errorMessage={errors.email}
        size="md"
      />
      
      <StandaloneSelect
        label="Category"
        placeholder="Select a category"
        options={[
          { value: "support", label: "Support" },
          { value: "sales", label: "Sales" },
          { value: "billing", label: "Billing" },
        ]}
        helperText="Select the category that best matches your inquiry"
        value={formData.category}
        onValueChange={(value) => setFormData({ ...formData, category: value })}
        isError={!!errors.category}
        errorMessage={errors.category}
        variant="filled"
      />
      
      <StandaloneRadioGroup
        label="Preferred Contact Method"
        options={[
          { value: "email", label: "Email" },
          { value: "phone", label: "Phone" },
          { value: "mail", label: "Mail" },
        ]}
        helperText="How would you like us to contact you?"
        value={formData.contactPreference}
        onValueChange={(value) => setFormData({ ...formData, contactPreference: value })}
      />
      
      <StandaloneTextarea
        label="Message"
        placeholder="Enter your message"
        helperText="Please be as specific as possible"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        isError={!!errors.message}
        errorMessage={errors.message}
        size="md"
        resize="vertical"
      />
      
      <StandaloneCheckbox
        label="Subscribe to newsletter"
        helperText="Receive updates about our products and services"
        checked={formData.subscribe}
        onCheckedChange={(checked) => setFormData({ ...formData, subscribe: !!checked })}
      />
      
      <StandaloneSwitch
        label="Enable notifications"
        helperText="Receive notifications about your account"
        checked={formData.notifications}
        onCheckedChange={(checked) => setFormData({ ...formData, notifications: !!checked })}
        size="md"
      />
      
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Variants and Sizes

All form components support consistent variants and sizes:

### Variants

```tsx
// Default variant
<StandaloneInput variant="default" />

// Filled variant
<StandaloneInput variant="filled" />

// Outline variant
<StandaloneInput variant="outline" />

// Flushed variant (for Input and Textarea)
<StandaloneInput variant="flushed" />
```

### Sizes

```tsx
// Small size
<StandaloneInput size="sm" />

// Medium size (default)
<StandaloneInput size="md" />

// Large size
<StandaloneInput size="lg" />
```

## Error States and Validation

All form components support error states and validation messages:

```tsx
// With React Hook Form (validation handled automatically)
<FormInput
  name="email"
  label="Email"
  placeholder="Enter your email"
/>

// With standalone components (manual validation)
<StandaloneInput
  label="Email"
  placeholder="Enter your email"
  isError={!isValidEmail}
  errorMessage="Please enter a valid email address"
/>
```

## Accessibility Features

All enhanced form components include accessibility improvements:

- Proper labeling with `htmlFor` and `id` associations
- Error states with `aria-invalid` and `aria-describedby`
- Helper text with `aria-describedby`
- Keyboard navigation support
- Screen reader announcements for errors

## Best Practices

1. **Use Form* components with React Hook Form**:
   - For complex forms with validation
   - When you need form state management
   - For consistent error handling

2. **Use Standalone* components for simple cases**:
   - For single form elements
   - When you don't need complex validation
   - For controlled components with custom state

3. **Choose appropriate variants**:
   - `default` for most forms
   - `filled` for dense forms or when you want to emphasize the field
   - `outline` for emphasized inputs
   - `flushed` for minimal interfaces

4. **Use consistent sizing**:
   - `md` for most inputs
   - `sm` for compact forms
   - `lg` for important or primary inputs

5. **Always provide context**:
   - Use labels for all form elements
   - Add helper text for additional information
   - Show clear error messages for validation issues
