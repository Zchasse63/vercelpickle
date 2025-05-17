import React from 'react';
import { render } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import { captureComponentSnapshot, SnapshotOptions, defaultSnapshotOptions } from './snapshot-testing';
import { ComponentFactoryConfig, CompoundComponentFactoryConfig } from './component-factory';
import { CompositionConfig } from './component-composition';
import { ComposedComponentFactoryConfig, ComposedCompoundComponentFactoryConfig } from './component-composition-factory';

/**
 * Options for capturing factory component snapshots
 */
export interface FactoryComponentSnapshotOptions extends SnapshotOptions {
  /** The variants to capture */
  variants?: Record<string, string[]>;
  /** Additional props to apply to the component */
  additionalProps?: Record<string, any>;
}

/**
 * Captures snapshots of a component created with the component factory pattern
 *
 * @param factoryConfig The component factory configuration
 * @param options Options for capturing the snapshot
 * @returns An object mapping variant combinations to snapshots
 *
 * @example
 * ```tsx
 * const snapshots = captureFactoryComponentSnapshots(
 *   {
 *     name: 'Button',
 *     element: 'button',
 *     baseClassName: 'btn',
 *     variants: {
 *       variant: {
 *         default: 'btn-default',
 *         primary: 'btn-primary',
 *         secondary: 'btn-secondary',
 *       },
 *       size: {
 *         sm: 'btn-sm',
 *         md: 'btn-md',
 *         lg: 'btn-lg',
 *       },
 *     },
 *     defaultVariants: {
 *       variant: 'default',
 *       size: 'md',
 *     },
 *   },
 *   {
 *     variants: {
 *       variant: ['default', 'primary', 'secondary'],
 *       size: ['sm', 'md', 'lg'],
 *     },
 *     additionalProps: { children: 'Click me' },
 *   }
 * );
 *
 * Object.entries(snapshots).forEach(([variantCombination, snapshot]) => {
 *   expect(snapshot).toMatchSnapshot(`Button with ${variantCombination}`);
 * });
 * ```
 */
export function captureFactoryComponentSnapshots<T extends React.ElementType = 'div'>(
  factoryConfig: ComponentFactoryConfig<T>,
  options: FactoryComponentSnapshotOptions = {}
): Record<string, string> {
  // Merge options with defaults
  const mergedOptions = { ...defaultSnapshotOptions, variants: {}, additionalProps: {}, ...options };

  // Import the createComponent function
  const { createComponent } = require('./component-factory');

  // Create the component
  const Component = createComponent(factoryConfig);

  // Create snapshots for each variant combination
  const snapshots: Record<string, string> = {};

  // If no variants specified, capture a snapshot with default variants
  if (Object.keys(mergedOptions.variants || {}).length === 0) {
    // Create props with default variants
    const props = {
      ...factoryConfig.defaultVariants,
      ...mergedOptions.additionalProps,
    };

    // Create the component with the props
    const component = React.createElement(Component, props);

    // Capture the snapshot
    snapshots['default'] = captureComponentSnapshot(component, mergedOptions);

    return snapshots;
  }

  // Generate all combinations of variants
  const variantNames = Object.keys(mergedOptions.variants || {});
  const variantCombinations = generateVariantCombinations(variantNames, mergedOptions.variants || {});

  // Capture a snapshot for each combination
  variantCombinations.forEach((combination) => {
    // Create props with the variant combination
    const props = {
      ...factoryConfig.defaultVariants,
      ...combination,
      ...mergedOptions.additionalProps,
    };

    // Create the component with the props
    const component = React.createElement(Component, props);

    // Capture the snapshot
    const combinationString = Object.entries(combination)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    snapshots[combinationString] = captureComponentSnapshot(component, mergedOptions);
  });

  return snapshots;
}

/**
 * Options for capturing compound component snapshots
 */
export interface CompoundComponentSnapshotOptions extends SnapshotOptions {
  /** The variants to capture */
  variants?: Record<string, string[]>;
  /** Additional props to apply to the component */
  additionalProps?: Record<string, any>;
  /** The parts to include in the snapshot */
  parts?: string[];
}

/**
 * Captures snapshots of a compound component created with the component factory pattern
 *
 * @param factoryConfig The compound component factory configuration
 * @param options Options for capturing the snapshot
 * @returns An object mapping variant combinations to snapshots
 *
 * @example
 * ```tsx
 * const snapshots = captureCompoundComponentSnapshots(
 *   {
 *     name: 'Card',
 *     element: 'div',
 *     baseClassName: 'card',
 *     parts: {
 *       Header: {
 *         element: 'div',
 *         baseClassName: 'card-header',
 *       },
 *       Body: {
 *         element: 'div',
 *         baseClassName: 'card-body',
 *       },
 *       Footer: {
 *         element: 'div',
 *         baseClassName: 'card-footer',
 *       },
 *     },
 *   },
 *   {
 *     parts: ['Header', 'Body', 'Footer'],
 *   }
 * );
 *
 * Object.entries(snapshots).forEach(([variantCombination, snapshot]) => {
 *   expect(snapshot).toMatchSnapshot(`Card with ${variantCombination}`);
 * });
 * ```
 */
export function captureCompoundComponentSnapshots<
  T extends React.ElementType = 'div',
  Parts extends string = string
>(
  factoryConfig: CompoundComponentFactoryConfig<T, Parts>,
  options: CompoundComponentSnapshotOptions = {}
): Record<string, string> {
  // Merge options with defaults
  const mergedOptions = {
    ...defaultSnapshotOptions,
    variants: {},
    additionalProps: {},
    parts: Object.keys(factoryConfig.parts),
    ...options,
  };

  // Import the createCompoundComponent function
  const { createCompoundComponent } = require('./component-factory');

  // Create the component
  const Component = createCompoundComponent(factoryConfig);

  // Create snapshots for each variant combination
  const snapshots: Record<string, string> = {};

  // If no variants specified, capture a snapshot with default variants
  if (Object.keys(mergedOptions.variants || {}).length === 0) {
    // Create props with default variants
    const props = {
      ...factoryConfig.defaultVariants,
      ...mergedOptions.additionalProps,
    };

    // Create the component with the props and parts
    const component = React.createElement(
      Component,
      props,
      mergedOptions.parts?.map((part) => {
        const PartComponent = Component[part as keyof typeof Component];
        return React.createElement(PartComponent, { key: part }, `${part} content`);
      })
    );

    // Capture the snapshot
    snapshots['default'] = captureComponentSnapshot(component, mergedOptions);

    return snapshots;
  }

  // Generate all combinations of variants
  const variantNames = Object.keys(mergedOptions.variants || {});
  const variantCombinations = generateVariantCombinations(variantNames, mergedOptions.variants || {});

  // Capture a snapshot for each combination
  variantCombinations.forEach((combination) => {
    // Create props with the variant combination
    const props = {
      ...factoryConfig.defaultVariants,
      ...combination,
      ...mergedOptions.additionalProps,
    };

    // Create the component with the props and parts
    const component = React.createElement(
      Component,
      props,
      mergedOptions.parts?.map((part) => {
        const PartComponent = Component[part as keyof typeof Component];
        return React.createElement(PartComponent, { key: part }, `${part} content`);
      })
    );

    // Capture the snapshot
    const combinationString = Object.entries(combination)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    snapshots[combinationString] = captureComponentSnapshot(component, mergedOptions);
  });

  return snapshots;
}

/**
 * Options for capturing composed component snapshots
 */
export interface ComposedComponentSnapshotOptions extends SnapshotOptions {
  /** Additional props to apply to the component */
  additionalProps?: Record<string, any>;
}

/**
 * Captures snapshots of a component created with the component composition system
 *
 * @param compositionConfig The composition configuration
 * @param components The components to compose
 * @param options Options for capturing the snapshot
 * @returns The snapshot as a string
 *
 * @example
 * ```tsx
 * const snapshot = captureComposedComponentSnapshots(
 *   {
 *     name: 'FormField',
 *     type: 'vertical',
 *     gap: 'sm',
 *   },
 *   [
 *     { component: Label, props: { children: 'Email' } },
 *     { component: Input, props: { type: 'email' } },
 *     { component: ErrorMessage, props: { children: 'Invalid email' } },
 *   ]
 * );
 *
 * expect(snapshot).toMatchSnapshot('FormField');
 * ```
 */
export function captureComposedComponentSnapshots(
  compositionConfig: CompositionConfig,
  components: any[],
  options: ComposedComponentSnapshotOptions = {}
): string {
  // Merge options with defaults
  const mergedOptions = { ...defaultSnapshotOptions, additionalProps: {}, ...options };

  // Import the composeComponents function
  const { composeComponents } = require('./component-composition');

  // Create the component
  const Component = composeComponents(compositionConfig, components);

  // Create props
  const props = {
    ...mergedOptions.additionalProps,
  };

  // Render the component
  const { container } = render(<Component {...props} />);

  // Get the root element
  const rootElement = container.firstChild as HTMLElement;

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

  return snapshot;
}

/**
 * Options for capturing composed factory component snapshots
 */
export interface ComposedFactoryComponentSnapshotOptions extends SnapshotOptions {
  /** Additional props to apply to the component */
  additionalProps?: Record<string, any>;
}

/**
 * Captures snapshots of a component created with the component composition factory
 *
 * @param factoryConfig The composed component factory configuration
 * @param options Options for capturing the snapshot
 * @returns The snapshot as a string
 *
 * @example
 * ```tsx
 * const snapshot = captureComposedFactoryComponentSnapshots(
 *   {
 *     factory: {
 *       name: 'FormField',
 *       element: 'div',
 *       baseClassName: 'form-field',
 *     },
 *     composition: {
 *       name: 'FormField',
 *       type: 'vertical',
 *       gap: 'sm',
 *     },
 *     components: [
 *       { component: Label, props: { children: 'Email' } },
 *       { component: Input, props: { type: 'email' } },
 *       { component: ErrorMessage, props: { children: 'Invalid email' } },
 *     ],
 *   }
 * );
 *
 * expect(snapshot).toMatchSnapshot('FormField');
 * ```
 */
export function captureComposedFactoryComponentSnapshots(
  factoryConfig: ComposedComponentFactoryConfig,
  options: ComposedFactoryComponentSnapshotOptions = {}
): string {
  // Merge options with defaults
  const mergedOptions = { ...defaultSnapshotOptions, additionalProps: {}, ...options };

  // Import the createComposedComponent function
  const { createComposedComponent } = require('./component-composition-factory');

  // Create the component
  const Component = createComposedComponent(factoryConfig);

  // Create props
  const props = {
    ...mergedOptions.additionalProps,
  };

  // Render the component
  const { container } = render(<Component {...props} />);

  // Get the root element
  const rootElement = container.firstChild as HTMLElement;

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

  return snapshot;
}

/**
 * Generates all combinations of variants
 *
 * @param variantNames The names of the variants
 * @param variants The variants to combine
 * @returns An array of variant combinations
 */
function generateVariantCombinations(
  variantNames: string[],
  variants: Record<string, string[]>
): Record<string, string>[] {
  // If no variant names, return an empty array
  if (variantNames.length === 0) {
    return [];
  }

  // If only one variant name, return an array of objects with that variant
  if (variantNames.length === 1) {
    const variantName = variantNames[0];
    return variants[variantName].map((value) => ({ [variantName]: value }));
  }

  // Get the first variant name
  const firstVariantName = variantNames[0];

  // Get the remaining variant names
  const remainingVariantNames = variantNames.slice(1);

  // Generate combinations for the remaining variant names
  const remainingCombinations = generateVariantCombinations(remainingVariantNames, variants);

  // Combine the first variant with the remaining combinations
  const combinations: Record<string, string>[] = [];

  variants[firstVariantName].forEach((value) => {
    remainingCombinations.forEach((combination) => {
      combinations.push({
        [firstVariantName]: value,
        ...combination,
      });
    });
  });

  return combinations;
}
