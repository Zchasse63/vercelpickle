# Animation Guide for Pickle B2B Marketplace

**Last Updated:** `2023-05-11`

> **Note**: For a comprehensive overview of the animation system architecture, see the [Animation System Documentation](ANIMATION_SYSTEM.md).

This guide explains how to use the animation system in the Pickle B2B Marketplace project. We've successfully integrated Framer Motion for animations throughout the application, providing smooth transitions and interactions for an enhanced user experience.

## Table of Contents

1. [Implementation Status](#implementation-status)
2. [Animation Philosophy](#animation-philosophy)
3. [Animation Components](#animation-components)
4. [Animation Presets](#animation-presets)
5. [Animation Hooks](#animation-hooks)
6. [CSS Animations](#css-animations)
7. [Performance Considerations](#performance-considerations)
8. [Accessibility](#accessibility)
9. [Examples](#examples)

## Implementation Status

The animation system has been successfully implemented with the following components and features:

| Component/Feature | Status | Notes |
|-------------------|--------|-------|
| Framer Motion Integration | ✅ Complete | Core library integrated and working |
| Base Animation Components | ✅ Complete | `<Animated>` and related components implemented |
| Page Transitions | ✅ Complete | Smooth transitions between pages |
| Hover Animations | ✅ Complete | Interactive elements have hover effects |
| Loading Animations | ✅ Complete | Skeleton loaders and spinners implemented |
| Modal Animations | ✅ Complete | Smooth entry/exit for modals and drawers |
| Form Feedback | ✅ Complete | Visual feedback for form interactions |
| Staggered Animations | ✅ Complete | List and grid items animate sequentially |
| Reduced Motion Support | ✅ Complete | Respects user preferences for reduced motion |
| TypeScript Integration | ✅ Complete | All animation components are fully typed |

Recent fixes:
- Resolved TypeScript issues with animation components
- Fixed animation component prop types
- Enhanced performance of animations on mobile devices
- Improved accessibility with reduced motion support

## Animation Philosophy

Our animation system follows these principles:

1. **Performance First**: Use CSS animations for simple effects, Framer Motion for complex ones
2. **Purpose-Driven**: Each animation serves a specific UX purpose
3. **Accessibility**: Respect user preferences for reduced motion
4. **Consistency**: Use standardized animations across the application

## Animation Components

### Basic Components

- `<Animated>`: Base component for all animations
- `<AnimatedContainer>`: For staggered animations of child elements
- `<AnimatedItem>`: For individual animated elements
- `<AnimatedImage>`: For image animations
- `<AnimatedButton>`: For button animations

### Page Components

- `<PageTransition>`: Wraps page content with a fade-in animation
- `<StaggeredList>`: Animates list items with a staggered effect

## Animation Presets

Presets are predefined animation configurations for different UI elements.

```tsx
// Import presets
import { presets } from "@/lib/animation-presets";

// Use a preset
<AnimatedItem {...presets.productCard}>
  <ProductCard />
</AnimatedItem>

// Use a preset with delay
<AnimatedItem
  {...getPresetWithDelay("listItem", index)}
>
  <ListItem />
</AnimatedItem>
```

Available presets:

| Preset | Description | Use Case |
|--------|-------------|----------|
| `pageEnter` | Fade in animation for pages | Page transitions |
| `pageExit` | Fade out animation for pages | Page transitions |
| `listItem` | Fade up animation for list items | Lists, grids |
| `buttonHover` | Scale on hover, compress on tap | Buttons, interactive elements |
| `productCard` | Fade in, lift on hover | Product cards |
| `productImage` | Scale in, scale on hover | Product images |
| `notification` | Slide in from left | Notifications, toasts |
| `formElement` | Subtle fade in | Form fields, inputs |
| `modal` | Scale animation | Modals, dialogs |
| `drawer` | Slide in from right | Sidebars, drawers |

## Animation Hooks

Custom hooks for more complex animation patterns:

### useAnimationSettings

```tsx
const { shouldAnimate, prefersReducedMotion, isFirstLoad } = useAnimationSettings();

// Only animate if user preferences allow
if (shouldAnimate) {
  // Animate
}
```

### useScrollAnimation

```tsx
const scrollAnimation = useScrollAnimation({
  threshold: 0.1,
  rootMargin: "0px",
  variant: "listItem",
  once: true,
});

return (
  <motion.div
    ref={scrollAnimation.ref}
    initial={scrollAnimation.initial}
    animate={scrollAnimation.animate}
    variants={scrollAnimation.variants}
  >
    Content
  </motion.div>
);
```

### useStaggeredAnimation

```tsx
const { containerRef, containerProps, getItemProps } = useStaggeredAnimation(
  items.length,
  { itemDelay: 0.05, containerDelay: 0.1 }
);

return (
  <motion.div ref={containerRef} {...containerProps}>
    {items.map((item, index) => (
      <motion.div key={item.id} {...getItemProps(index)}>
        {item.content}
      </motion.div>
    ))}
  </motion.div>
);
```

## CSS Animations

For simple animations, use the CSS utility classes:

```tsx
<div className="animate-fade-in">Content</div>
<div className="animate-fade-up delay-200">Delayed content</div>
<div className="hover:scale-105 transition-transform duration-200">Hover me</div>
```

Available CSS animation classes:

| Class | Description |
|-------|-------------|
| `animate-fade-in` | Fade in animation |
| `animate-fade-up` | Fade up animation |
| `animate-fade-down` | Fade down animation |
| `animate-fade-left` | Fade left animation |
| `animate-fade-right` | Fade right animation |
| `animate-scale` | Scale animation |
| `animate-stagger-fade-in` | Staggered fade in for children |
| `hover:scale-105` | Scale on hover |
| `hover:-translate-y-1` | Lift on hover |
| `delay-100` | 100ms animation delay |
| `delay-200` | 200ms animation delay |
| `delay-300` | 300ms animation delay |
| `delay-400` | 400ms animation delay |
| `delay-500` | 500ms animation delay |

## Performance Considerations

1. **Avoid animating expensive properties**: Stick to `opacity` and `transform` when possible
2. **Use `will-change` sparingly**: Only for complex animations that need it
3. **Disable animations during initial load**: Use the `isFirstLoad` check
4. **Lazy load animation components**: For pages that don't need immediate animations

## Accessibility

Our animation system automatically respects the user's `prefers-reduced-motion` setting:

```tsx
// This will not animate if user prefers reduced motion
<AnimatedItem variant="fadeInUp">
  <Content />
</AnimatedItem>

// Force animation even if user prefers reduced motion (use sparingly)
<AnimatedItem variant="fadeInUp" isCritical={true}>
  <ImportantContent />
</AnimatedItem>

// Force disable animation
<AnimatedItem disableAnimation={true}>
  <Content />
</AnimatedItem>
```

## Examples

### Product Grid with Staggered Animation

```tsx
function ProductGrid({ products }) {
  const { containerRef, containerProps, getItemProps } = useStaggeredAnimation(
    products.length,
    { itemDelay: 0.05, containerDelay: 0.1 }
  );

  return (
    <motion.div
      ref={containerRef}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      {...containerProps}
    >
      {products.map((product, index) => (
        <motion.div key={product.id} {...getItemProps(index)}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Page Transition

```tsx
function ProductPage() {
  return (
    <PageTransition>
      <h1>Product Details</h1>
      <ProductDetails />
    </PageTransition>
  );
}
```

### Button with Animation

```tsx
function SubmitButton() {
  return (
    <AnimatedButton
      variant="fadeIn"
      whileHover="hoverScale"
      whileTap="scale"
      onClick={handleSubmit}
    >
      Submit
    </AnimatedButton>
  );
}
```
