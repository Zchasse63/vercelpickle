# Textarea Component Usage Examples

**Last Updated:** `2025-05-06`

This document provides examples of how to use the enhanced Textarea component in the Pickle B2B Marketplace platform.

## Basic Usage

```tsx
import { Textarea } from "@/components/ui/textarea"

// Default textarea
<Textarea placeholder="Enter your message" />

// Textarea with variant
<Textarea variant="filled" placeholder="Enter your message" />

// Textarea with size
<Textarea size="lg" placeholder="Enter your message" />

// Disabled textarea
<Textarea disabled placeholder="This field is disabled" />
```

## Variants

```tsx
import { Textarea } from "@/components/ui/textarea"

// Default variant
<Textarea variant="default" placeholder="Default textarea" />

// Filled variant
<Textarea variant="filled" placeholder="Filled textarea" />

// Outline variant
<Textarea variant="outline" placeholder="Outline textarea" />

// Flushed variant
<Textarea variant="flushed" placeholder="Flushed textarea" />
```

## Sizes

```tsx
import { Textarea } from "@/components/ui/textarea"

// Small size
<Textarea size="sm" placeholder="Small textarea" />

// Medium size (default)
<Textarea size="md" placeholder="Medium textarea" />

// Large size
<Textarea size="lg" placeholder="Large textarea" />
```

## Resize Options

```tsx
import { Textarea } from "@/components/ui/textarea"

// No resize
<Textarea resize="none" placeholder="Cannot be resized" />

// Vertical resize (default)
<Textarea resize="vertical" placeholder="Can be resized vertically" />

// Horizontal resize
<Textarea resize="horizontal" placeholder="Can be resized horizontally" />

// Both directions resize
<Textarea resize="both" placeholder="Can be resized in both directions" />
```

## Error State

```tsx
import { Textarea } from "@/components/ui/textarea"

// Textarea with error state
<Textarea 
  isError 
  placeholder="Enter your message" 
/>

// Textarea with error message
<Textarea 
  isError 
  errorMessage="Please enter a valid message" 
  placeholder="Enter your message" 
/>

// Conditionally show error state
<Textarea 
  isError={!isValid} 
  errorMessage={errorMessage} 
  placeholder="Enter your message" 
/>
```

## Helper Text

```tsx
import { Textarea } from "@/components/ui/textarea"

// Textarea with helper text
<Textarea 
  helperText="Please keep your message concise and relevant." 
  placeholder="Enter your message" 
/>

// Textarea with helper text and error
<Textarea 
  helperText="Please keep your message concise and relevant." 
  isError={!isValid}
  errorMessage="Your message is too short"
  placeholder="Enter your message" 
/>
```

## Form Integration

```tsx
import { Textarea } from "@/components/ui/textarea"

// Form with textarea
<form onSubmit={handleSubmit}>
  <Textarea 
    name="message"
    placeholder="Enter your message"
    helperText="Please keep your message concise and relevant."
    isError={errors.message}
    errorMessage={errors.message?.message}
    required
  />
  {/* Other form fields */}
  <button type="submit">Submit</button>
</form>
```

## Combined Examples

```tsx
import { Textarea } from "@/components/ui/textarea"

// Product description textarea
<Textarea 
  variant="filled"
  placeholder="Enter product description..."
  size="lg"
  resize="vertical"
  helperText="Describe your product in detail (max 500 characters)"
/>

// Feedback textarea
<Textarea 
  placeholder="Tell us what you think about our service"
  helperText="Your feedback helps us improve"
  resize="vertical"
/>

// Support request textarea with validation
<Textarea 
  placeholder="Describe your issue in detail"
  isError={message.length < 20}
  errorMessage="Please provide more details about your issue"
  resize="vertical"
/>

// Address textarea
<Textarea 
  placeholder="Enter your full address"
  size="sm"
  resize="none"
  helperText="Include street, city, state, and zip code"
/>
```

## Best Practices

1. **Use appropriate variants for different contexts**:
   - `default` for most forms
   - `filled` for dense forms or when you want to emphasize the field
   - `outline` for emphasized inputs
   - `flushed` for minimal interfaces

2. **Use consistent sizing**:
   - `md` for most textareas
   - `sm` for compact forms
   - `lg` for important or primary textareas

3. **Choose appropriate resize behavior**:
   - `vertical` for most cases (default)
   - `none` for fixed-size textareas
   - `both` when the user might need to adjust the width and height
   - `horizontal` rarely used, but available if needed

4. **Always provide helpful context**:
   - Use placeholder text to suggest the expected input
   - Use helper text to provide additional information
   - Use error messages to explain validation issues

5. **Handle error states appropriately**:
   - Provide clear error messages
   - Use helper text to guide users
   - Validate input as needed
