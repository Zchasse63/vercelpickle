# Button Component Usage Examples

**Last Updated:** `2025-05-06`

This document provides examples of how to use the enhanced Button component in the Pickle B2B Marketplace platform.

## Basic Usage

```tsx
import { Button } from "@/components/ui/button"

// Default button
<Button>Click me</Button>

// Button with variant
<Button variant="outline">Outline Button</Button>

// Button with size
<Button size="lg">Large Button</Button>

// Disabled button
<Button disabled>Disabled Button</Button>
```

## Loading State

```tsx
import { Button } from "@/components/ui/button"

// Button with loading state
<Button isLoading>Loading</Button>

// Button with loading state and variant
<Button isLoading variant="outline">Loading</Button>

// Conditionally show loading state
<Button isLoading={isSubmitting}>
  {isSubmitting ? "Submitting..." : "Submit"}
</Button>
```

## Icons

```tsx
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, Save } from "lucide-react"

// Button with left icon
<Button leftIcon={<Plus />}>Add Item</Button>

// Button with right icon
<Button rightIcon={<ArrowRight />}>Next</Button>

// Button with both icons
<Button leftIcon={<Save />} rightIcon={<ArrowRight />}>Save and Continue</Button>

// Icon button
<Button size="icon" aria-label="Add item">
  <Plus />
</Button>
```

## Brand Variants

```tsx
import { Button } from "@/components/ui/button"

// Using the new brand prop (recommended)
<Button brand="dill">Dill Button</Button>
<Button brand="pickle">Pickle Button</Button>
<Button brand="mustard">Mustard Button</Button>
<Button brand="beige">Beige Button</Button>
<Button brand="olive">Olive Button</Button>

// Using the legacy variant prop (for backward compatibility)
<Button variant="dill">Dill Button</Button>
<Button variant="pickle">Pickle Button</Button>
<Button variant="mustard">Mustard Button</Button>
<Button variant="beige">Beige Button</Button>
<Button variant="olive">Olive Button</Button>
```

## Combining Props

```tsx
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

// Combining multiple props
<Button 
  brand="pickle" 
  size="lg" 
  leftIcon={<ShoppingCart />}
>
  Add to Cart
</Button>

// Loading state with brand variant
<Button 
  brand="dill" 
  isLoading={isProcessing}
>
  Process Order
</Button>

// Disabled state with brand variant
<Button 
  brand="mustard" 
  disabled={!isValid}
>
  Submit
</Button>
```

## With Link

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

// Button as link
<Button asChild>
  <Link href="/products">View Products</Link>
</Button>

// Button as link with icon
<Button asChild rightIcon={<ExternalLink />}>
  <Link href="/products">View Products</Link>
</Button>

// Brand button as link
<Button asChild brand="pickle">
  <Link href="/products">View Products</Link>
</Button>
```

## Form Submission

```tsx
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

// Form submission button
<form onSubmit={handleSubmit}>
  {/* Form fields */}
  <Button 
    type="submit" 
    leftIcon={<Save />} 
    isLoading={isSubmitting}
  >
    {isSubmitting ? "Saving..." : "Save"}
  </Button>
</form>
```

## Best Practices

1. **Use appropriate variants for different actions**:
   - `default` or brand variants for primary actions
   - `outline` for secondary actions
   - `destructive` for dangerous actions
   - `ghost` for subtle actions
   - `link` for navigation-like actions

2. **Use consistent sizing**:
   - `default` for most buttons
   - `sm` for compact UIs
   - `lg` for important actions
   - `xl` for call-to-action buttons
   - `icon` for icon-only buttons

3. **Always include text for accessibility**:
   - For icon-only buttons, use `aria-label` to provide a text alternative
   - Example: `<Button size="icon" aria-label="Add item"><Plus /></Button>`

4. **Use loading state for async actions**:
   - Show loading state during form submissions
   - Disable the button while loading
   - Consider showing a different text while loading

5. **Use brand variants consistently**:
   - `dill` for primary actions
   - `pickle` for success actions
   - `mustard` for warning actions
   - `beige` for neutral actions
   - `olive` for informational actions
