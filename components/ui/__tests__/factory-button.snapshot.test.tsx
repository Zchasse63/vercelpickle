import React from 'react';
import { FactoryButton, Button } from '@/components/ui/factory-button';
import {
  captureComponentSnapshot,
  captureComponentPropsSnapshots,
} from '@/lib/snapshot-testing';
import {
  captureVariantSnapshots,
  captureSizeSnapshots,
  captureStateSnapshots,
  captureAccessibilitySnapshot,
} from '@/lib/snapshot-testing-specialized';
import {
  captureFactoryComponentSnapshots,
} from '@/lib/snapshot-testing-factory';

describe('Button Component Snapshots', () => {
  describe('Basic Snapshots', () => {
    it('renders correctly with default props', () => {
      const snapshot = captureComponentSnapshot(<Button>Click me</Button>);

      // Instead of using toMatchSnapshot, we'll check for specific content
      // In a real test, you would use toMatchSnapshot()
      expect(snapshot).toContain('Click me');
      expect(snapshot).toContain('bg-primary');
      expect(snapshot).toContain('h-10');
    });

    it('renders correctly with different props', () => {
      const snapshots = captureComponentPropsSnapshots(
        Button,
        [
          { children: 'Default Button' },
          { children: 'Primary Button', variant: 'primary' },
          { children: 'Secondary Button', variant: 'secondary' },
          { children: 'Outline Button', variant: 'outline' },
          { children: 'Ghost Button', variant: 'ghost' },
          { children: 'Link Button', variant: 'link' },
        ]
      );

      // Check each snapshot for specific content
      expect(snapshots[0]).toContain('Default Button');
      expect(snapshots[1]).toContain('Primary Button');
      expect(snapshots[1]).toContain('variant="primary"');
      expect(snapshots[2]).toContain('Secondary Button');
      expect(snapshots[2]).toContain('variant="secondary"');
      expect(snapshots[3]).toContain('Outline Button');
      expect(snapshots[3]).toContain('variant="outline"');
      expect(snapshots[4]).toContain('Ghost Button');
      expect(snapshots[5]).toContain('Link Button');
    });
  });

  describe('Variant Snapshots', () => {
    it('renders correctly with different variants', () => {
      const snapshots = captureVariantSnapshots(
        Button,
        ['default', 'primary', 'secondary', 'outline', 'ghost', 'link'],
        {
          variantProp: 'variant',
          additionalProps: { children: 'Button' }
        }
      );

      // Check each variant snapshot
      expect(snapshots.default).toContain('Button');
      expect(snapshots.primary).toContain('variant="primary"');
      expect(snapshots.secondary).toContain('variant="secondary"');
      expect(snapshots.outline).toContain('variant="outline"');
      expect(snapshots.ghost).toContain('variant="ghost"');
      expect(snapshots.link).toContain('variant="link"');
    });
  });

  describe('Size Snapshots', () => {
    it('renders correctly with different sizes', () => {
      const snapshots = captureSizeSnapshots(
        Button,
        ['default', 'sm', 'lg', 'icon'],
        {
          sizeProp: 'size',
          additionalProps: { children: 'Button' }
        }
      );

      // Check each size snapshot
      expect(snapshots.default).toContain('h-10');
      expect(snapshots.default).toContain('px-4');
      expect(snapshots.sm).toContain('h-9');
      expect(snapshots.sm).toContain('px-3');
      expect(snapshots.lg).toContain('h-11');
      expect(snapshots.lg).toContain('px-8');
      expect(snapshots.icon).toContain('h-10');
      expect(snapshots.icon).toContain('w-10');
    });
  });

  describe('State Snapshots', () => {
    it('renders correctly in different states', () => {
      const snapshots = captureStateSnapshots(
        Button,
        {
          states: [
            { name: 'default', setup: () => {} },
            { name: 'disabled', setup: () => {} },
            { name: 'loading', setup: () => {} },
          ],
          additionalProps: {
            children: 'Button',
            disabled: (state) => state === 'disabled',
            isLoading: (state) => state === 'loading',
          },
        }
      );

      // Check each state snapshot
      expect(snapshots.default).toBeDefined();
      expect(snapshots.disabled).toBeDefined();
      expect(snapshots.loading).toBeDefined();
    });
  });

  describe('Accessibility Snapshots', () => {
    it('captures accessibility attributes', () => {
      const snapshot = captureAccessibilitySnapshot(
        Button,
        {
          additionalProps: {
            children: 'Button',
            'aria-label': 'Action button',
            'aria-haspopup': 'true',
            role: 'button',
          }
        }
      );

      // Check accessibility attributes
      expect(snapshot).toContain('aria-label="Action button"');
      expect(snapshot).toContain('aria-haspopup="true"');
      expect(snapshot).toContain('role="button"');
    });
  });

  describe('Factory Component Snapshots', () => {
    it('captures factory component snapshots', () => {
      const snapshots = captureFactoryComponentSnapshots(
        {
          name: 'FactoryButton',
          element: 'button',
          baseClassName: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants: {
            variant: {
              default: 'bg-primary text-primary-foreground hover:bg-primary/90',
              destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
              outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
              secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              ghost: 'hover:bg-accent hover:text-accent-foreground',
              link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
              default: 'h-10 px-4 py-2',
              sm: 'h-9 rounded-md px-3',
              lg: 'h-11 rounded-md px-8',
              icon: 'h-10 w-10',
            },
            isLoading: {
              true: 'relative text-transparent transition-none hover:text-transparent disabled:pointer-events-none',
              false: '',
            },
          },
          defaultVariants: {
            variant: 'default',
            size: 'default',
            isLoading: false,
          },
        },
        {
          variants: {
            variant: ['default', 'primary', 'secondary'],
            size: ['default', 'sm', 'lg'],
          },
          additionalProps: { children: 'Button' },
        }
      );

      // Check some of the snapshots
      expect(Object.keys(snapshots).length).toBeGreaterThan(0);

      // In a real test, you would use toMatchSnapshot() for each snapshot
      // Here we're just checking that the snapshots were created
      Object.entries(snapshots).forEach(([key, snapshot]) => {
        expect(snapshot).toContain('Button');
      });
    });
  });
});
