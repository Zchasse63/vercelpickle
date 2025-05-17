import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  captureComponentSnapshot,
  captureComponentPropsSnapshots,
  compareSnapshots,
  createSnapshotSerializer,
  toMatchDOMSnapshot,
} from '@/lib/snapshot-testing';
import {
  captureVariantSnapshots,
  captureSizeSnapshots,
  captureStateSnapshots,
  captureResponsiveSnapshots,
  captureAccessibilitySnapshot,
} from '@/lib/snapshot-testing-specialized';
import {
  captureFactoryComponentSnapshots,
  captureCompoundComponentSnapshots,
  captureComposedComponentSnapshots,
  captureComposedFactoryComponentSnapshots,
} from '@/lib/snapshot-testing-factory';
import { createComponent, createCompoundComponent } from '@/lib/component-factory';
import { composeComponents } from '@/lib/component-composition';
import { createComposedComponent } from '@/lib/component-composition-factory';

// Mock components for testing
const Button = ({
  variant = 'default',
  size = 'default',
  disabled,
  className,
  children,
  onClick,
  ...props
}: {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  [key: string]: any;
}) => {
  const variantClasses = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
  };

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const classes = [
    'rounded',
    variantClasses[variant],
    sizeClasses[size || 'md'],
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  );
};

// Factory component for testing
const FactoryButton = createComponent({
  name: 'FactoryButton',
  element: 'button',
  baseClassName: 'rounded',
  variants: {
    variant: {
      default: 'bg-gray-200 text-gray-800',
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
    },
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// Compound component for testing
const Card = createCompoundComponent({
  name: 'Card',
  element: 'div',
  baseClassName: 'rounded border',
  parts: {
    Header: {
      element: 'div',
      baseClassName: 'p-4 border-b',
    },
    Body: {
      element: 'div',
      baseClassName: 'p-4',
    },
    Footer: {
      element: 'div',
      baseClassName: 'p-4 border-t',
    },
  },
});

// Composed component for testing
const FormField = composeComponents(
  {
    name: 'FormField',
    type: 'vertical',
    gap: 'sm',
  },
  [
    {
      component: ({ children }: { children: React.ReactNode }) => (
        <label className="text-sm font-medium">{children}</label>
      ),
      props: { children: 'Email' }
    },
    {
      component: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input className="border rounded px-3 py-2" {...props} />
      ),
      props: { type: 'email' }
    },
    {
      component: ({ children }: { children: React.ReactNode }) => (
        <p className="text-sm text-red-500">{children}</p>
      ),
      props: { children: 'Invalid email' },
      condition: (props) => !!props.error,
    },
  ]
);

// Composed factory component for testing
const ComposedFormField = createComposedComponent({
  factory: {
    name: 'ComposedFormField',
    element: 'div',
    baseClassName: 'space-y-2',
  },
  composition: {
    name: 'ComposedFormField',
    type: 'vertical',
    gap: 'sm',
  },
  components: [
    {
      component: ({ children }: { children: React.ReactNode }) => (
        <label className="text-sm font-medium">{children}</label>
      ),
      props: { children: 'Email' }
    },
    {
      component: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input className="border rounded px-3 py-2" {...props} />
      ),
      props: { type: 'email' }
    },
    {
      component: ({ children }: { children: React.ReactNode }) => (
        <p className="text-sm text-red-500">{children}</p>
      ),
      props: { children: 'Invalid email' },
      condition: (props) => !!props.error,
    },
  ],
});

describe('Snapshot Testing', () => {
  describe('Core Snapshot Testing Utilities', () => {
    it('captures a component snapshot', () => {
      const snapshot = captureComponentSnapshot(<Button>Click me</Button>);

      expect(snapshot).toContain('<button');
      expect(snapshot).toContain('Click me');
      expect(snapshot).toContain('data-testid="button"');
    });

    it('captures component props snapshots', () => {
      const snapshots = captureComponentPropsSnapshots(
        Button,
        [
          { children: 'Click me' },
          { children: 'Click me', variant: 'primary' },
          { children: 'Click me', variant: 'secondary' },
        ]
      );

      expect(snapshots).toHaveLength(3);
      expect(snapshots[0]).toContain('bg-gray-200');
      expect(snapshots[1]).toContain('bg-blue-500');
      expect(snapshots[2]).toContain('bg-gray-500');
    });

    it('compares snapshots', () => {
      const snapshot1 = captureComponentSnapshot(<Button>Click me</Button>);
      const snapshot2 = captureComponentSnapshot(<Button variant="primary">Click me</Button>);

      const differences = compareSnapshots(snapshot1, snapshot2);

      expect(differences.length).toBeGreaterThan(0);
      expect(differences.some(diff => diff.includes('bg-gray-200'))).toBe(true);
      expect(differences.some(diff => diff.includes('bg-blue-500'))).toBe(true);
    });

    it('creates a custom snapshot serializer', () => {
      const serializer = createSnapshotSerializer();

      expect(serializer.test).toBeDefined();
      expect(serializer.print).toBeDefined();

      const { container } = render(<Button>Click me</Button>);
      const button = container.firstChild as HTMLElement;

      expect(serializer.test(button)).toBe(true);
      expect(serializer.print(button)).toContain('Click me');
    });

    it('provides a custom matcher for DOM snapshots', () => {
      const { container } = render(<Button>Click me</Button>);
      const button = container.firstChild as HTMLElement;

      const result = toMatchDOMSnapshot(button);

      expect(result.pass).toBe(true);
      expect(typeof result.message).toBe('function');
    });
  });

  describe('Specialized Snapshot Testing Functions', () => {
    it('captures variant snapshots', () => {
      const snapshots = captureVariantSnapshots(
        Button,
        ['default', 'primary', 'secondary'],
        { variantProp: 'variant', additionalProps: { children: 'Click me' } }
      );

      expect(Object.keys(snapshots)).toHaveLength(3);
      expect(snapshots.default).toContain('bg-gray-200');
      expect(snapshots.primary).toContain('bg-blue-500');
      expect(snapshots.secondary).toContain('bg-gray-500');
    });

    it('captures size snapshots', () => {
      const snapshots = captureSizeSnapshots(
        Button,
        ['sm', 'md', 'lg'],
        { sizeProp: 'size', additionalProps: { children: 'Click me' } }
      );

      expect(Object.keys(snapshots)).toHaveLength(3);
      expect(snapshots.sm).toContain('text-sm');
      expect(snapshots.md).toContain('text-base');
      expect(snapshots.lg).toContain('text-lg');
    });

    it('captures state snapshots', () => {
      const snapshots = captureStateSnapshots(
        Button,
        {
          states: [
            { name: 'default', setup: () => {} },
            { name: 'hover', setup: (element) => userEvent.hover(element) },
            { name: 'active', setup: (element) => userEvent.click(element) },
          ],
          additionalProps: { children: 'Click me' },
        }
      );

      expect(Object.keys(snapshots)).toHaveLength(3);
      expect(typeof snapshots.default).toBe('string');
      expect(typeof snapshots.hover).toBe('string');
      expect(typeof snapshots.active).toBe('string');
    });

    it('captures responsive snapshots', () => {
      const snapshots = captureResponsiveSnapshots(
        Button,
        {
          screenSizes: [
            { name: 'mobile', width: 375, height: 667 },
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'desktop', width: 1440, height: 900 },
          ],
          additionalProps: { children: 'Click me' },
        }
      );

      expect(Object.keys(snapshots)).toHaveLength(3);
      expect(snapshots.mobile).toBeDefined();
      expect(snapshots.tablet).toBeDefined();
      expect(snapshots.desktop).toBeDefined();
    });

    it('captures accessibility snapshots', () => {
      const snapshot = captureAccessibilitySnapshot(
        Button,
        { additionalProps: { children: 'Click me', 'aria-label': 'Click me button' } }
      );

      expect(snapshot).toContain('Accessibility');
      expect(snapshot).toContain('aria-label="Click me button"');
    });
  });

  describe('Factory Integration', () => {
    it('captures factory component snapshots', () => {
      const snapshots = captureFactoryComponentSnapshots(
        {
          name: 'Button',
          element: 'button',
          baseClassName: 'rounded',
          variants: {
            variant: {
              default: 'bg-gray-200 text-gray-800',
              primary: 'bg-blue-500 text-white',
              secondary: 'bg-gray-500 text-white',
            },
            size: {
              sm: 'text-sm px-2 py-1',
              md: 'text-base px-4 py-2',
              lg: 'text-lg px-6 py-3',
            },
          },
          defaultVariants: {
            variant: 'default',
            size: 'md',
          },
        },
        {
          variants: {
            variant: ['default', 'primary'],
            size: ['sm', 'lg'],
          },
          additionalProps: { children: 'Click me' },
        }
      );

      expect(Object.keys(snapshots)).toHaveLength(4);
      expect(snapshots['variant=default, size=sm']).toBeDefined();
      expect(snapshots['variant=default, size=lg']).toBeDefined();
      expect(snapshots['variant=primary, size=sm']).toBeDefined();
      expect(snapshots['variant=primary, size=lg']).toBeDefined();
    });

    it('captures compound component snapshots', () => {
      const snapshots = captureCompoundComponentSnapshots(
        {
          name: 'Card',
          element: 'div',
          baseClassName: 'rounded border',
          parts: {
            Header: {
              element: 'div',
              baseClassName: 'p-4 border-b',
            },
            Body: {
              element: 'div',
              baseClassName: 'p-4',
            },
            Footer: {
              element: 'div',
              baseClassName: 'p-4 border-t',
            },
          },
        },
        {
          parts: ['Header', 'Body', 'Footer'],
        }
      );

      expect(snapshots.default).toBeDefined();
      expect(snapshots.default).toContain('Header content');
      expect(snapshots.default).toContain('Body content');
      expect(snapshots.default).toContain('Footer content');
    });

    it('captures composed component snapshots', () => {
      const snapshot = captureComposedComponentSnapshots(
        {
          name: 'FormField',
          type: 'vertical',
          gap: 'sm',
        },
        [
          {
            component: ({ children }: { children: React.ReactNode }) => (
              <label className="text-sm font-medium">{children}</label>
            ),
            props: { children: 'Email' }
          },
          {
            component: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
              <input className="border rounded px-3 py-2" {...props} />
            ),
            props: { type: 'email' }
          },
        ]
      );

      expect(snapshot).toContain('Email');
      expect(snapshot).toContain('input');
      expect(snapshot).toContain('border rounded px-3 py-2');
    });

    it('captures composed factory component snapshots', () => {
      const snapshot = captureComposedFactoryComponentSnapshots(
        {
          factory: {
            name: 'FormField',
            element: 'div',
            baseClassName: 'space-y-2',
          },
          composition: {
            name: 'FormField',
            type: 'vertical',
            gap: 'sm',
          },
          components: [
            {
              component: ({ children }: { children: React.ReactNode }) => (
                <label className="text-sm font-medium">{children}</label>
              ),
              props: { children: 'Email' }
            },
            {
              component: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
                <input className="border rounded px-3 py-2" {...props} />
              ),
              props: { type: 'email' }
            },
          ],
        }
      );

      expect(snapshot).toContain('Email');
      expect(snapshot).toContain('input');
      expect(snapshot).toContain('border rounded px-3 py-2');
    });
  });
});
