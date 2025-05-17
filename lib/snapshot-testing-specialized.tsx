import React from 'react';
import { render, screen } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import { captureComponentSnapshot, SnapshotOptions, defaultSnapshotOptions } from './snapshot-testing';
import userEvent from '@testing-library/user-event';

/**
 * Options for capturing variant snapshots
 */
export interface VariantSnapshotOptions extends SnapshotOptions {
  /** The variant prop name */
  variantProp?: string;
  /** Additional props to apply to the component */
  additionalProps?: Record<string, any>;
}

/**
 * Captures snapshots of a component with different variants
 *
 * @param Component The React component to capture
 * @param variants An array of variant values
 * @param options Options for capturing the snapshot
 * @returns An object mapping variant values to snapshots
 *
 * @example
 * ```tsx
 * const snapshots = captureVariantSnapshots(
 *   Button,
 *   ['default', 'primary', 'secondary'],
 *   { variantProp: 'variant' }
 * );
 *
 * Object.entries(snapshots).forEach(([variant, snapshot]) => {
 *   expect(snapshot).toMatchSnapshot(`Button with variant ${variant}`);
 * });
 * ```
 */
export function captureVariantSnapshots<P = any>(
  Component: React.ComponentType<P>,
  variants: string[],
  options: VariantSnapshotOptions = {}
): Record<string, string> {
  // Merge options with defaults
  const mergedOptions = { ...defaultSnapshotOptions, variantProp: 'variant', additionalProps: {}, ...options };

  // Create snapshots for each variant
  const snapshots: Record<string, string> = {};

  variants.forEach((variant) => {
    // Create props with the variant
    const props = {
      ...mergedOptions.additionalProps,
      [mergedOptions.variantProp as string]: variant,
    } as P;

    // Create the component with the props
    const component = React.createElement(Component, props);

    // Capture the snapshot
    snapshots[variant] = captureComponentSnapshot(component, mergedOptions);
  });

  return snapshots;
}

/**
 * Options for capturing size snapshots
 */
export interface SizeSnapshotOptions extends SnapshotOptions {
  /** The size prop name */
  sizeProp?: string;
  /** Additional props to apply to the component */
  additionalProps?: Record<string, any>;
}

/**
 * Captures snapshots of a component with different sizes
 *
 * @param Component The React component to capture
 * @param sizes An array of size values
 * @param options Options for capturing the snapshot
 * @returns An object mapping size values to snapshots
 *
 * @example
 * ```tsx
 * const snapshots = captureSizeSnapshots(
 *   Button,
 *   ['sm', 'md', 'lg'],
 *   { sizeProp: 'size' }
 * );
 *
 * Object.entries(snapshots).forEach(([size, snapshot]) => {
 *   expect(snapshot).toMatchSnapshot(`Button with size ${size}`);
 * });
 * ```
 */
export function captureSizeSnapshots<P = any>(
  Component: React.ComponentType<P>,
  sizes: string[],
  options: SizeSnapshotOptions = {}
): Record<string, string> {
  // Merge options with defaults
  const mergedOptions = { ...defaultSnapshotOptions, sizeProp: 'size', additionalProps: {}, ...options };

  // Create snapshots for each size
  const snapshots: Record<string, string> = {};

  sizes.forEach((size) => {
    // Create props with the size
    const props = {
      ...mergedOptions.additionalProps,
      [mergedOptions.sizeProp as string]: size,
    } as P;

    // Create the component with the props
    const component = React.createElement(Component, props);

    // Capture the snapshot
    snapshots[size] = captureComponentSnapshot(component, mergedOptions);
  });

  return snapshots;
}

/**
 * Options for capturing state snapshots
 */
export interface StateSnapshotOptions extends SnapshotOptions {
  /** The state to capture */
  states: {
    /** The name of the state */
    name: string;
    /** A function to set up the state */
    setup: (element: HTMLElement) => void;
  }[];
  /** Additional props to apply to the component */
  additionalProps?: Record<string, any>;
}

/**
 * Captures snapshots of a component in different states
 *
 * @param Component The React component to capture
 * @param options Options for capturing the snapshot
 * @returns An object mapping state names to snapshots
 *
 * @example
 * ```tsx
 * const snapshots = captureStateSnapshots(
 *   Button,
 *   {
 *     states: [
 *       { name: 'default', setup: () => {} },
 *       { name: 'hover', setup: (element) => userEvent.hover(element) },
 *       { name: 'active', setup: (element) => userEvent.click(element) },
 *     ],
 *     additionalProps: { children: 'Click me' },
 *   }
 * );
 *
 * Object.entries(snapshots).forEach(([state, snapshot]) => {
 *   expect(snapshot).toMatchSnapshot(`Button in ${state} state`);
 * });
 * ```
 */
export function captureStateSnapshots<P = any>(
  Component: React.ComponentType<P>,
  options: StateSnapshotOptions
): Record<string, string> {
  // Merge options with defaults
  const mergedOptions = { ...defaultSnapshotOptions, ...options };

  // Create snapshots for each state
  const snapshots: Record<string, string> = {};

  mergedOptions.states.forEach(({ name, setup }) => {
    // Create props
    const props = {
      ...mergedOptions.additionalProps,
    } as P;

    // Render the component
    const { container } = render(React.createElement(Component, props));

    // Get the root element
    const rootElement = container.firstChild as HTMLElement;

    // Set up the state
    setup(rootElement);

    // Create a snapshot of the element
    let snapshot = '';

    // Include DOM structure
    snapshot += prettyDOM(rootElement, {
      maxDepth: mergedOptions.maxDepth,
    });

    // Include props
    snapshot += '\n\nProps:\n';

    // Get all attributes
    const attributes = Array.from(rootElement.attributes);

    // Add each attribute to the snapshot
    attributes.forEach((attribute) => {
      snapshot += `${attribute.name}="${attribute.value}"\n`;
    });

    // Include styling
    if (mergedOptions.includeStyling) {
      snapshot += '\n\nStyling:\n';

      // Get computed style
      const computedStyle = window.getComputedStyle(rootElement);

      // Add each style property to the snapshot
      for (let i = 0; i < computedStyle.length; i++) {
        const property = computedStyle[i];
        const value = computedStyle.getPropertyValue(property);

        // Only include non-default styles
        if (value && value !== 'initial' && value !== 'auto') {
          snapshot += `${property}: ${value}\n`;
        }
      }
    }

    // Include accessibility
    if (mergedOptions.includeAccessibility) {
      snapshot += '\n\nAccessibility:\n';

      // Get accessibility attributes
      const role = rootElement.getAttribute('role');
      const ariaAttributes = Array.from(rootElement.attributes)
        .filter((attribute) => attribute.name.startsWith('aria-'));

      // Add role to the snapshot
      if (role) {
        snapshot += `role="${role}"\n`;
      }

      // Add each aria attribute to the snapshot
      ariaAttributes.forEach((attribute) => {
        snapshot += `${attribute.name}="${attribute.value}"\n`;
      });
    }

    // Add the snapshot to the snapshots object
    snapshots[name] = snapshot;
  });

  return snapshots;
}

/**
 * Options for capturing responsive snapshots
 */
export interface ResponsiveSnapshotOptions extends SnapshotOptions {
  /** The screen sizes to capture */
  screenSizes: {
    /** The name of the screen size */
    name: string;
    /** The width of the screen */
    width: number;
    /** The height of the screen */
    height: number;
  }[];
  /** Additional props to apply to the component */
  additionalProps?: Record<string, any>;
}

/**
 * Captures snapshots of a component at different screen sizes
 *
 * @param Component The React component to capture
 * @param options Options for capturing the snapshot
 * @returns An object mapping screen size names to snapshots
 *
 * @example
 * ```tsx
 * const snapshots = captureResponsiveSnapshots(
 *   Button,
 *   {
 *     screenSizes: [
 *       { name: 'mobile', width: 375, height: 667 },
 *       { name: 'tablet', width: 768, height: 1024 },
 *       { name: 'desktop', width: 1440, height: 900 },
 *     ],
 *     additionalProps: { children: 'Click me' },
 *   }
 * );
 *
 * Object.entries(snapshots).forEach(([screenSize, snapshot]) => {
 *   expect(snapshot).toMatchSnapshot(`Button at ${screenSize} screen size`);
 * });
 * ```
 */
export function captureResponsiveSnapshots<P = any>(
  Component: React.ComponentType<P>,
  options: ResponsiveSnapshotOptions
): Record<string, string> {
  // Merge options with defaults
  const mergedOptions = { ...defaultSnapshotOptions, ...options };

  // Create snapshots for each screen size
  const snapshots: Record<string, string> = {};

  mergedOptions.screenSizes.forEach(({ name, width, height }) => {
    // Save original window dimensions
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;

    // Set window dimensions
    window.innerWidth = width;
    window.innerHeight = height;

    // Create props
    const props = {
      ...mergedOptions.additionalProps,
    } as P;

    // Create the component with the props
    const component = React.createElement(Component, props);

    // Capture the snapshot
    snapshots[name] = captureComponentSnapshot(component, mergedOptions);

    // Restore original window dimensions
    window.innerWidth = originalWidth;
    window.innerHeight = originalHeight;
  });

  return snapshots;
}

/**
 * Options for capturing accessibility snapshots
 */
export interface AccessibilitySnapshotOptions extends SnapshotOptions {
  /** Additional props to apply to the component */
  additionalProps?: Record<string, any>;
}

/**
 * Captures accessibility snapshots of a component
 *
 * @param Component The React component to capture
 * @param options Options for capturing the snapshot
 * @returns An object with accessibility information
 *
 * @example
 * ```tsx
 * const snapshot = captureAccessibilitySnapshot(
 *   Button,
 *   { additionalProps: { children: 'Click me' } }
 * );
 *
 * expect(snapshot).toMatchSnapshot('Button accessibility');
 * ```
 */
export function captureAccessibilitySnapshot<P = any>(
  Component: React.ComponentType<P>,
  options: AccessibilitySnapshotOptions = {}
): string {
  // Merge options with defaults
  const mergedOptions = { ...defaultSnapshotOptions, ...options, includeAccessibility: true };

  // Create props
  const props = {
    ...mergedOptions.additionalProps,
  } as P;

  // Create the component with the props
  const component = React.createElement(Component, props);

  // Capture the snapshot
  return captureComponentSnapshot(component, mergedOptions);
}
