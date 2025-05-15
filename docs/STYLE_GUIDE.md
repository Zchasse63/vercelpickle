# Pickle B2B Marketplace Style Guide

**Created:** `2025-05-07`
**Last Updated:** `2025-05-07`

This document serves as a comprehensive style guide for the Pickle B2B Marketplace project. It outlines the design system, color palette, typography, component usage, and best practices for maintaining a consistent visual language across the application.

## Brand Colors

The Pickle B2B Marketplace uses a custom color palette that reflects the brand identity:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Dill Green | `#194D33` | Primary color, used for main actions, headers, and important UI elements |
| Pickle Green | `#5A9A3D` | Secondary color, used for supporting elements and accents |
| Golden Mustard | `#F3B522` | Accent color, used for highlights, calls to action, and important notifications |
| Brined Beige | `#F1E5C3` | Background color, used for cards, containers, and subtle backgrounds |
| Smoked Olive | `#A09A84` | Neutral color, used for borders, dividers, and muted text |

## Typography

The application uses the Inter font family for all text elements:

- **Headings**: Inter, semi-bold or bold weight
  - H1: 3rem (48px), line-height: 1.2
  - H2: 2.25rem (36px), line-height: 1.2
  - H3: 1.5rem (24px), line-height: 1.3
  - H4: 1.25rem (20px), line-height: 1.4
  - H5: 1rem (16px), line-height: 1.5

- **Body Text**: Inter, regular weight
  - Large: 1.125rem (18px), line-height: 1.6
  - Regular: 1rem (16px), line-height: 1.5
  - Small: 0.875rem (14px), line-height: 1.5
  - Extra Small: 0.75rem (12px), line-height: 1.5

## Spacing

The application uses a consistent spacing system based on a 4px grid:

- **Extra Small**: 0.25rem (4px)
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 1.5rem (24px)
- **Extra Large**: 2rem (32px)
- **2XL**: 3rem (48px)
- **3XL**: 4rem (64px)

## Components

### Buttons

Buttons are used for primary actions and navigation. They come in several variants:

- **Default**: Primary color (Dill Green) with white text
- **Secondary**: Secondary color (Pickle Green) with white text
- **Outline**: Transparent background with a border
- **Ghost**: Transparent background with no border
- **Link**: Text-only button with underline on hover
- **Brand Variants**: Dill, Pickle, Mustard, Beige, Olive

Button sizes:
- **Small**: Height of 9 (36px)
- **Default**: Height of 10 (40px)
- **Large**: Height of 11 (44px)
- **Extra Large**: Height of 12 (48px)
- **Icon**: Square button with equal width and height

Usage example:
```jsx
<Button>Default Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>
<Button brand="dill">Dill Button</Button>
<Button brand="pickle">Pickle Button</Button>
<Button brand="mustard">Mustard Button</Button>
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>
<Button size="xl">Extra Large Button</Button>
```

### Cards

Cards are used to group related content and actions:

- **Card**: Container with rounded corners, border, and shadow
- **CardHeader**: Top section of the card, typically contains title and description
- **CardTitle**: Main heading of the card
- **CardDescription**: Subheading or description text
- **CardContent**: Main content area of the card
- **CardFooter**: Bottom section of the card, typically contains actions

Usage example:
```jsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badges

Badges are used to highlight status, categories, or counts:

- **Default**: Primary color (Dill Green) with white text
- **Secondary**: Secondary color (Pickle Green) with white text
- **Outline**: Transparent background with a border
- **Destructive**: Red background for error or warning states
- **Brand Variants**: Dill, Pickle, Mustard, Beige, Olive

Usage example:
```jsx
<Badge>Default Badge</Badge>
<Badge variant="secondary">Secondary Badge</Badge>
<Badge variant="outline">Outline Badge</Badge>
<Badge variant="destructive">Destructive Badge</Badge>
<Badge variant="dill">Dill Badge</Badge>
<Badge variant="pickle">Pickle Badge</Badge>
<Badge variant="mustard">Mustard Badge</Badge>
```

## Layout Guidelines

### Container

Use the container class to maintain consistent width and padding across different screen sizes:

```jsx
<div className="container px-4 md:px-6">
  {/* Content goes here */}
</div>
```

### Grid System

Use Tailwind's grid system for creating responsive layouts:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items go here */}
</div>
```

### Responsive Breakpoints

- **sm**: 640px and above
- **md**: 768px and above
- **lg**: 1024px and above
- **xl**: 1280px and above
- **2xl**: 1536px and above

## Best Practices

1. **Consistency**: Use the defined color palette, typography, and spacing consistently throughout the application.

2. **Accessibility**: Ensure sufficient color contrast for text and interactive elements. Use semantic HTML elements.

3. **Responsive Design**: Design for mobile first, then adapt for larger screens.

4. **Component Reuse**: Use the defined UI components rather than creating custom styles.

5. **Dark Mode**: Support dark mode by using the theme variables rather than hardcoded colors.

6. **Brand Identity**: Maintain the brand identity by using the brand colors appropriately.

7. **Spacing**: Use consistent spacing between elements to create a harmonious layout.

8. **Typography Hierarchy**: Use appropriate heading levels to create a clear visual hierarchy.

## Implementation Notes

- Use the `cn()` utility function for combining Tailwind classes conditionally.
- Use the theme variables defined in globals.css for colors.
- Use the brand-specific variants for components when appropriate.
- Test all UI changes in both light and dark mode.
