# Animation System Documentation

**Last Updated:** `2023-05-11`

## Overview

The Pickle B2B Marketplace platform uses a comprehensive animation system built on Framer Motion to provide smooth, accessible, and performant animations throughout the application. This document outlines the animation system architecture, available hooks, and best practices for implementing animations.

## Animation Architecture

The animation system consists of several key components:

1. **Animation Hooks**: Custom React hooks that provide declarative APIs for common animation patterns
2. **Animated Component**: A wrapper component that applies animations to any content
3. **Animation Utilities**: Helper functions for creating and managing animations
4. **Animation Settings**: User preferences for reduced motion and animation performance

## Animation Hooks

### `useAnimationSettings`

This hook provides information about the user's animation preferences and the current animation state.

```tsx
const { shouldAnimate, prefersReducedMotion, isFirstLoad } = useAnimationSettings();
```

- `shouldAnimate`: Boolean indicating whether animations should be played
- `prefersReducedMotion`: Boolean indicating if the user prefers reduced motion
- `isFirstLoad`: Boolean indicating if this is the first load of the application

### `useScrollAnimation`

This hook provides scroll-triggered animations for elements.

```tsx
const { ref, className } = useScrollAnimation({
  animationClass: animations.fadeInUp,
  threshold: 0.1,
  once: true,
});

return <div ref={ref} className={className}>Content</div>;
```

- `ref`: Ref to attach to the element you want to animate
- `className`: Class name to apply to the element
- `animationClass`: Animation class to apply (default: fadeInUp)
- `threshold`: Intersection threshold (0-1) for triggering the animation
- `once`: Whether the animation should only play once

### `useStaggeredAnimation`

This hook provides staggered animations for lists of items.

```tsx
const { containerRef, containerClassName, getItemClassName } = useStaggeredAnimation(
  items.length,
  {
    animationClass: animations.fadeInUp,
    containerDelay: 100,
    once: true,
  }
);

return (
  <ul ref={containerRef} className={containerClassName}>
    {items.map((item, index) => (
      <li key={item.id} className={getItemClassName(index)}>
        {item.content}
      </li>
    ))}
  </ul>
);
```

### `useInteractiveAnimation`

This hook provides interactive animations for elements that respond to user interaction.

```tsx
const { scale, animationProps } = useInteractiveAnimation({
  initialScale: 1,
  hoverScale: 1.05,
  tapScale: 0.95,
});

return (
  <motion.div
    style={{ scale }}
    {...animationProps}
  >
    Interactive content
  </motion.div>
);
```

### `useScrollLinkedAnimation`

This hook provides animations that are linked to the scroll position.

```tsx
const { ref, opacity } = useScrollLinkedAnimation({
  inputRange: [0, 1],
  outputRange: [0, 1],
  property: "opacity",
});

return (
  <motion.div
    ref={ref}
    style={{ opacity }}
  >
    Content that fades in as you scroll
  </motion.div>
);
```

### `useAnimationPerformance`

This hook provides performance tracking for animations.

```tsx
const { startTracking, endTracking } = useAnimationPerformance("my-animation");

// Start tracking before animation
startTracking();

// End tracking after animation
endTracking();
```

## Animated Component

The `Animated` component provides a simple way to add animations to any content.

```tsx
<Animated
  variant="fadeInUp"
  delay={0.2}
  duration={0.5}
  isCritical={true}
>
  Content to animate
</Animated>
```

### Props

- `variant`: Animation variant to use (fadeIn, fadeInUp, scale, etc.)
- `delay`: Delay before animation starts (in seconds)
- `duration`: Duration of the animation (in seconds)
- `isCritical`: Whether this animation is critical and should play even on first load
- `disableAnimation`: Whether to disable the animation
- `as`: Element type to render (default: div)
- `whileHover`: Animation to apply on hover
- `whileTap`: Animation to apply on tap/click

## Animation Utilities

### Animation Classes

The `animations` object provides CSS class names for common animations:

```tsx
import { animations } from "@/lib/animations";

<div className={animations.fadeIn}>Content</div>
```

Available animations:
- `fadeIn`: Fade in
- `fadeInUp`: Fade in and move up
- `fadeInDown`: Fade in and move down
- `fadeInLeft`: Fade in and move left
- `fadeInRight`: Fade in and move right
- `fadeOut`: Fade out
- `scale`: Scale up
- `hoverScale`: Scale up on hover
- `hoverLift`: Move up on hover
- `pulse`: Pulse animation
- `bounce`: Bounce animation

### Animation Variants

The animation system also provides Framer Motion variants for common animations:

```tsx
import { fadeIn, fadeInUp, scale } from "@/lib/animations";

<motion.div
  variants={fadeInUp(0.5, 0.2)}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

## Best Practices

### Accessibility

- Always respect the user's preference for reduced motion
- Provide alternative experiences for users who prefer reduced motion
- Avoid animations that could trigger vestibular disorders

```tsx
const { shouldAnimate } = useAnimationSettings();

return shouldAnimate ? (
  <AnimatedVersion />
) : (
  <StaticVersion />
);
```

### Performance

- Use the `useAnimationPerformance` hook to track animation performance
- Avoid animating properties that trigger layout (width, height, top, left)
- Prefer animating transform and opacity for better performance
- Use `will-change` sparingly and only when needed

### Implementation

- Use the provided hooks and components instead of creating custom animations
- Follow the animation patterns established in the design system
- Test animations on different devices and screen sizes
- Ensure animations work correctly in both light and dark mode

## Examples

### Fade In on Scroll

```tsx
function FadeInSection({ children }) {
  const { ref, className } = useScrollAnimation({
    animationClass: animations.fadeInUp,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

### Staggered List Animation

```tsx
function AnimatedList({ items }) {
  const { containerRef, getItemClassName } = useStaggeredAnimation(items.length);

  return (
    <ul ref={containerRef}>
      {items.map((item, index) => (
        <li key={item.id} className={getItemClassName(index)}>
          {item.content}
        </li>
      ))}
    </ul>
  );
}
```

### Interactive Button

```tsx
function AnimatedButton({ children, onClick }) {
  const { animationProps } = useInteractiveAnimation();

  return (
    <motion.button
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </motion.button>
  );
}
```

## Conclusion

The animation system provides a comprehensive set of tools for implementing animations throughout the Pickle B2B Marketplace platform. By following the patterns and best practices outlined in this document, you can create consistent, accessible, and performant animations that enhance the user experience.
