import { createCompoundComponent } from '@/lib/component-factory';

/**
 * Card component created using the compound component factory pattern
 */
export const Card = createCompoundComponent({
  name: 'Card',
  element: 'div',
  baseClassName: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  parts: {
    Header: {
      element: 'div',
      baseClassName: 'flex flex-col space-y-1.5 p-6',
    },
    Title: {
      element: 'h3',
      baseClassName: 'text-2xl font-semibold leading-none tracking-tight',
    },
    Description: {
      element: 'p',
      baseClassName: 'text-sm text-muted-foreground',
    },
    Content: {
      element: 'div',
      baseClassName: 'p-6 pt-0',
    },
    Footer: {
      element: 'div',
      baseClassName: 'flex items-center p-6 pt-0',
    },
  },
});
