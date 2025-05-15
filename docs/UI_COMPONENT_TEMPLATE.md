# UI Component Documentation Template

**Last Updated:** `2025-05-15`

## Overview

This template provides a standardized format for documenting UI components in the Pickle B2B Marketplace platform. Use this template when creating or updating component documentation.

## Component Name

Replace this with the name of the component (e.g., Button, Card, Dialog).

### Import

```tsx
import { ComponentName } from "@/components/ui-kit";
```

### Description

Provide a brief description of the component, its purpose, and when to use it.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "primary" \| "secondary" \| "destructive"` | `"default"` | The visual style of the component |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | The size of the component |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `className` | `string` | `""` | Additional CSS classes to apply |
| `children` | `React.ReactNode` | - | The content of the component |

### Variants

Describe the available variants and when to use each one.

#### Default

The standard variant for most use cases.

```tsx
<ComponentName variant="default">Content</ComponentName>
```

#### Primary

Used for primary actions or emphasis.

```tsx
<ComponentName variant="primary">Content</ComponentName>
```

#### Secondary

Used for secondary actions or less emphasis.

```tsx
<ComponentName variant="secondary">Content</ComponentName>
```

#### Destructive

Used for destructive actions like delete or remove.

```tsx
<ComponentName variant="destructive">Content</ComponentName>
```

### Sizes

Describe the available sizes and when to use each one.

#### Small (sm)

Used for compact layouts or secondary actions.

```tsx
<ComponentName size="sm">Content</ComponentName>
```

#### Medium (md)

The standard size for most use cases.

```tsx
<ComponentName size="md">Content</ComponentName>
```

#### Large (lg)

Used for emphasis or primary actions.

```tsx
<ComponentName size="lg">Content</ComponentName>
```

### Examples

Provide examples of common use cases for the component.

#### Basic Usage

```tsx
<ComponentName>Basic content</ComponentName>
```

#### With Variants and Sizes

```tsx
<ComponentName variant="primary" size="lg">
  Primary large content
</ComponentName>
```

#### With Custom Styling

```tsx
<ComponentName className="custom-class">
  Custom styled content
</ComponentName>
```

### Accessibility

Describe accessibility considerations for the component.

- Keyboard navigation
- Screen reader support
- ARIA attributes
- Color contrast

### Best Practices

Provide guidelines for using the component effectively.

#### Do

- Use for [specific purpose]
- Combine with [related components]
- Follow [specific pattern]

#### Don't

- Use for [inappropriate purpose]
- Combine with [incompatible components]
- Implement in [problematic way]

### Related Components

List related components that might be used together or as alternatives.

- [RelatedComponent1]: Used for [purpose]
- [RelatedComponent2]: Alternative for [scenario]

### Implementation Details

Provide any technical details that might be helpful for developers.

#### State Management

Describe how the component manages state internally.

#### Event Handling

Describe how the component handles events.

#### Composition

Describe how the component can be composed with other components.

### API Reference

Provide a detailed API reference for the component.

#### Component Props

Detailed description of all props, including advanced or less common props.

#### Compound Components

If the component has compound components (e.g., `ComponentName.Item`), document them here.

#### Context Providers

If the component uses or provides a React context, document it here.

### Changelog

| Version | Changes |
|---------|---------|
| 1.0.0   | Initial release |
| 1.1.0   | Added `newProp` prop |
| 1.2.0   | Deprecated `oldProp` prop |

## Usage Guidelines

When documenting a component:

1. Replace all placeholder content with actual component information
2. Remove sections that don't apply to the component
3. Add additional sections if needed for component-specific details
4. Include code examples for all common use cases
5. Ensure accessibility information is accurate and complete
6. Update the "Last Updated" date at the top of the document

## Example Documentation

See the following files for examples of completed component documentation:

- [Button Documentation](./examples/BUTTON_DOCUMENTATION.md)
- [Card Documentation](./examples/CARD_DOCUMENTATION.md)
- [Dialog Documentation](./examples/DIALOG_DOCUMENTATION.md)
