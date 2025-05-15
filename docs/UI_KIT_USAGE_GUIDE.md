# Pickle B2B Marketplace UI Kit Usage Guide

**Last Updated:** `2025-05-06`

## Introduction

This guide provides practical instructions for using the Pickle B2B Marketplace UI Kit in your development workflow. The UI Kit is a comprehensive collection of standardized, accessible, and responsive components designed to ensure consistency across the platform.

## Getting Started

### Importing Components

All UI components should be imported from the centralized UI Kit:

```tsx
// ✅ Correct way to import components
import { Button, Card, Input } from "@/components/ui-kit"

// ❌ Avoid importing directly from individual files
// import { Button } from "@/components/ui/button"
```

This ensures you're using the enhanced versions of components with all standardized features.

## Component Categories and Usage

### Form Components

Form components are available in two variants:

1. **Form*** components (integrated with React Hook Form)
2. **Standalone*** components (for use without React Hook Form)

#### With React Hook Form

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormInput, FormSelect, Button } from "@/components/ui-kit"

const formSchema = z.object({
  name: z.string().min(2),
  category: z.string(),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", category: "" },
  })

  function onSubmit(values) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="name"
          label="Name"
          placeholder="Enter name"
        />
        <FormSelect
          name="category"
          label="Category"
          options={[
            { value: "fruits", label: "Fruits" },
            { value: "vegetables", label: "Vegetables" },
          ]}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

#### Without React Hook Form

```tsx
import { useState } from "react"
import { StandaloneInput, StandaloneSelect, Button } from "@/components/ui-kit"

export function SimpleForm() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  
  return (
    <div className="space-y-4">
      <StandaloneInput
        label="Name"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <StandaloneSelect
        label="Category"
        options={[
          { value: "fruits", label: "Fruits" },
          { value: "vegetables", label: "Vegetables" },
        ]}
        value={category}
        onValueChange={setCategory}
      />
      <Button>Submit</Button>
    </div>
  )
}
```

### Layout Components

Layout components help structure your pages and content:

```tsx
import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-kit"

export function ProductDetails() {
  return (
    <Card>
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="details">Product details content...</TabsContent>
        <TabsContent value="specs">Product specifications content...</TabsContent>
        <TabsContent value="reviews">Product reviews content...</TabsContent>
      </Tabs>
    </Card>
  )
}
```

### Data Display Components

Data display components help present information effectively:

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from "@/components/ui-kit"

export function OrdersTable({ orders }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Best Practices

### 1. Use Consistent Variants and Sizes

All components support consistent variants and sizes:

```tsx
// Button variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Brand variants
<Button brand="dill">Dill</Button>
<Button brand="pickle">Pickle</Button>
```

### 2. Ensure Accessibility

All components include accessibility features, but you should still:

- Provide meaningful labels for form elements
- Use appropriate ARIA attributes when needed
- Ensure sufficient color contrast
- Test keyboard navigation

```tsx
// Good accessibility practices
<FormInput
  name="email"
  label="Email Address" // Clear label
  placeholder="Enter your email"
  required // Indicates required field
/>

<Button aria-label="Close dialog">
  <XIcon />
</Button>
```

### 3. Responsive Design

Components are responsive by default, but consider:

- Using responsive variants in Tailwind
- Testing on different screen sizes
- Using appropriate layout components

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <ProductCard />
  <ProductCard />
  <ProductCard />
</div>
```

### 4. Error Handling

Form components support built-in error handling:

```tsx
// With React Hook Form (errors handled automatically)
<FormInput name="email" label="Email" />

// With standalone components
<StandaloneInput
  label="Email"
  isError={!isValidEmail}
  errorMessage="Please enter a valid email address"
/>
```

### 5. Loading States

Many components support loading states:

```tsx
<Button isLoading>Submit</Button>

<StandaloneInput isLoading label="Search" />
```

## Feature-Specific Components

For feature-specific components (Admin, Buyer, Seller, Marketplace), refer to the dedicated documentation:

- [Admin Components Documentation](./examples/ADMIN_COMPONENTS_USAGE_EXAMPLE.md)
- [Buyer Components Documentation](./examples/BUYER_COMPONENTS_USAGE_EXAMPLE.md)
- [Seller Components Documentation](./examples/SELLER_COMPONENTS_USAGE_EXAMPLE.md)
- [Marketplace Components Documentation](./examples/MARKETPLACE_COMPONENTS_USAGE_EXAMPLE.md)

## Troubleshooting

### Common Issues

1. **Component not found**: Ensure you're importing from `@/components/ui-kit`
2. **Props type errors**: Check the component documentation for required props
3. **Styling inconsistencies**: Use the provided variants instead of custom styles
4. **Form validation errors**: Ensure you're using the correct validation schema

### Getting Help

If you encounter issues not covered in this guide:

1. Check the component-specific documentation
2. Review the UI Kit source code
3. Ask for help in the development team channel
