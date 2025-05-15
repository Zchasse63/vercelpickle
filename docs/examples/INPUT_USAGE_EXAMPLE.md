# Input Component Usage Examples

**Last Updated:** `2025-05-06`

This document provides examples of how to use the enhanced Input component in the Pickle B2B Marketplace platform.

## Basic Usage

```tsx
import { Input } from "@/components/ui/input"

// Default input
<Input placeholder="Enter your name" />

// Input with variant
<Input variant="filled" placeholder="Enter your email" />

// Input with size
<Input size="lg" placeholder="Enter your address" />

// Disabled input
<Input disabled placeholder="This field is disabled" />
```

## Variants

```tsx
import { Input } from "@/components/ui/input"

// Default variant
<Input variant="default" placeholder="Default input" />

// Filled variant
<Input variant="filled" placeholder="Filled input" />

// Outline variant
<Input variant="outline" placeholder="Outline input" />

// Flushed variant
<Input variant="flushed" placeholder="Flushed input" />
```

## Sizes

```tsx
import { Input } from "@/components/ui/input"

// Small size
<Input size="sm" placeholder="Small input" />

// Medium size (default)
<Input size="md" placeholder="Medium input" />

// Large size
<Input size="lg" placeholder="Large input" />
```

## Icons

```tsx
import { Input } from "@/components/ui/input"
import { Search, Mail, User, Lock } from "lucide-react"

// Input with left icon
<Input leftIcon={<Search />} placeholder="Search..." />

// Input with right icon
<Input rightIcon={<Mail />} placeholder="Enter your email" />

// Input with both icons
<Input 
  leftIcon={<User />} 
  rightIcon={<Lock />} 
  type="password" 
  placeholder="Enter password" 
/>
```

## Loading State

```tsx
import { Input } from "@/components/ui/input"

// Input with loading state
<Input isLoading placeholder="Loading..." />

// Conditionally show loading state
<Input 
  isLoading={isSubmitting} 
  placeholder="Enter your email" 
/>
```

## Error State

```tsx
import { Input } from "@/components/ui/input"

// Input with error state
<Input 
  isError 
  placeholder="Enter your email" 
/>

// Input with error message
<Input 
  isError 
  errorMessage="Please enter a valid email address" 
  placeholder="Enter your email" 
/>

// Conditionally show error state
<Input 
  isError={!isValid} 
  errorMessage={errorMessage} 
  placeholder="Enter your email" 
/>
```

## Helper Text

```tsx
import { Input } from "@/components/ui/input"

// Input with helper text
<Input 
  helperText="We'll never share your email with anyone else." 
  placeholder="Enter your email" 
/>

// Input with helper text and error
<Input 
  helperText="We'll never share your email with anyone else." 
  isError={!isValid}
  errorMessage="Please enter a valid email address"
  placeholder="Enter your email" 
/>
```

## Form Integration

```tsx
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

// Form with input
<form onSubmit={handleSubmit}>
  <Input 
    name="email"
    type="email"
    leftIcon={<Mail />}
    placeholder="Enter your email"
    helperText="We'll never share your email with anyone else."
    isError={errors.email}
    errorMessage={errors.email?.message}
    isLoading={isSubmitting}
    required
  />
  {/* Other form fields */}
  <button type="submit">Submit</button>
</form>
```

## Combined Examples

```tsx
import { Input } from "@/components/ui/input"
import { Search, User, Mail, Lock } from "lucide-react"

// Search input
<Input 
  variant="filled"
  leftIcon={<Search />}
  placeholder="Search products..."
  size="lg"
/>

// User profile input
<Input 
  leftIcon={<User />}
  placeholder="Enter your full name"
  helperText="As it appears on your ID"
/>

// Email input with validation
<Input 
  leftIcon={<Mail />}
  type="email"
  placeholder="Enter your email"
  isError={!isValidEmail}
  errorMessage="Please enter a valid email address"
/>

// Password input
<Input 
  leftIcon={<Lock />}
  type="password"
  placeholder="Enter your password"
  helperText="Must be at least 8 characters"
/>
```

## Best Practices

1. **Use appropriate variants for different contexts**:
   - `default` for most forms
   - `filled` for search inputs or dense forms
   - `outline` for emphasized inputs
   - `flushed` for minimal interfaces

2. **Use consistent sizing**:
   - `md` for most inputs
   - `sm` for compact forms
   - `lg` for important or primary inputs

3. **Always provide helpful context**:
   - Use placeholder text to suggest the expected input
   - Use helper text to provide additional information
   - Use error messages to explain validation issues

4. **Use icons consistently**:
   - Left icons for input type indicators (search, user, email)
   - Right icons for actions or status indicators

5. **Handle loading and error states appropriately**:
   - Disable inputs during loading
   - Provide clear error messages
   - Use helper text to guide users
