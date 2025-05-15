# Form State Management

## Overview

The Form State Management system provides a standardized approach to handling forms in the application. It uses React Hook Form for form state management and Zod for validation, with a consistent UI for form fields, error handling, and submission.

## Key Features

- **Centralized Form State Management**: All form state is managed by React Hook Form.
- **Consistent Validation**: All forms use Zod schemas for validation.
- **Standardized UI Components**: All form fields use the same UI components.
- **Error Handling**: All forms handle errors in a consistent way.
- **Loading States**: All forms include loading states for better UX.
- **Accessibility**: All form components are accessible.

## Components

### Form Wrapper

The `Form` component provides a wrapper for all forms in the application:

```tsx
<Form
  form={form}
  onSubmit={handleSubmit}
  status={status}
  successMessage="Profile updated successfully!"
  errorMessage="Failed to update profile. Please try again."
>
  {/* Form fields */}
</Form>
```

### Form Fields

The form system provides a variety of field components:

- `FormInput`: Text input field
- `FormTextarea`: Textarea field
- `FormCheckbox`: Checkbox field
- `FormSelect`: Select dropdown field
- `FormSwitch`: Toggle switch field
- `FormRadioGroup`: Radio button group
- `FormPhoneInput`: Phone number input with formatting
- `FormCreditCardInput`: Credit card input with formatting
- `FormExpiryInput`: Credit card expiry input with formatting
- `FormCvcInput`: Credit card CVC input

### Form Layout

The form system provides layout components:

- `FormSection`: Section with title and description
- `FormRow`: Row with multiple fields

## Usage Examples

### Basic Form

```tsx
import { useZodForm, Form, FormInput, FormCheckbox } from "@/lib/forms/exports";
import { z } from "zod";

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

// Define form component
function MyForm() {
  // Create form with Zod validation
  const form = useZodForm(formSchema, {
    defaultValues: {
      name: "",
      email: "",
      agreeToTerms: false,
    },
    onSubmit: async (data) => {
      // Handle form submission
      console.log(data);
    },
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit}>
      <FormInput
        name="name"
        label="Name"
        required
      />
      <FormInput
        name="email"
        label="Email"
        type="email"
        required
      />
      <FormCheckbox
        name="agreeToTerms"
        label="I agree to the terms and conditions"
      />
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </Form>
  );
}
```

### Profile Form

```tsx
import { useZodForm, Form, FormInput, FormTextarea, FormSection, FormRow } from "@/lib/forms/exports";
import { z } from "zod";

// Define form schema
const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  companyName: z.string().min(2, "Company name is required"),
  companyWebsite: z.string().url("Invalid website URL").optional().or(z.literal("")),
  companyDescription: z.string().optional(),
});

// Define form component
function ProfileForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  
  // Create form with Zod validation
  const form = useZodForm(profileSchema, {
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      companyName: "Acme Inc.",
      companyWebsite: "https://acme.example.com",
      companyDescription: "Acme Inc. is a leading provider of innovative solutions.",
    },
    onSubmit: async (data) => {
      setStatus("submitting");
      try {
        // Submit data to API
        await updateProfile(data);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    },
  });

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit}
      status={status}
      successMessage="Profile updated successfully!"
      errorMessage="Failed to update profile. Please try again."
    >
      <FormSection title="Personal Information">
        <FormRow>
          <FormInput
            name="firstName"
            label="First Name"
            required
          />
          <FormInput
            name="lastName"
            label="Last Name"
            required
          />
        </FormRow>
        <FormInput
          name="email"
          label="Email"
          type="email"
          required
        />
        <FormInput
          name="phone"
          label="Phone"
          required
        />
      </FormSection>
      
      <FormSection title="Company Information">
        <FormInput
          name="companyName"
          label="Company Name"
          required
        />
        <FormInput
          name="companyWebsite"
          label="Company Website"
        />
        <FormTextarea
          name="companyDescription"
          label="Company Description"
          rows={4}
        />
      </FormSection>
      
      <div className="flex justify-end mt-6">
        <button type="submit" disabled={form.isSubmitting}>
          {form.isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Form>
  );
}
```

## Best Practices

1. **Always use Zod schemas for validation**: Define a schema for each form.
2. **Use the provided form components**: Don't create new form components unless necessary.
3. **Handle loading states**: Use the `isSubmitting` property to show loading indicators.
4. **Handle errors**: Use the `status` property to show error messages.
5. **Use form sections and rows**: Use the provided layout components for consistent form layout.
6. **Add data-testid attributes**: Use the `testId` prop to add data-testid attributes for testing.
7. **Add aria attributes**: Use the provided aria attributes for accessibility.
