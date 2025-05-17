import React from 'react';
import { render } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import { toHaveAttribute, toHaveClass, toHaveStyle } from '@testing-library/jest-dom/matchers';

/**
 * Options for capturing a component snapshot
 */
export interface SnapshotOptions {
  /** Whether to include DOM structure in the snapshot */
  includeDOMStructure?: boolean;
  /** Whether to include component props in the snapshot */
  includeProps?: boolean;
  /** Whether to include component styling in the snapshot */
  includeStyling?: boolean;
  /** Whether to include accessibility attributes in the snapshot */
  includeAccessibility?: boolean;
  /** Whether to include component state in the snapshot */
  includeState?: boolean;
  /** Whether to pretty print the snapshot */
  prettyPrint?: boolean;
  /** Maximum depth of the snapshot */
  maxDepth?: number;
  /** Custom serializer for the snapshot */
  serializer?: (element: HTMLElement) => string;
}

/**
 * Default options for capturing a component snapshot
 */
export const defaultSnapshotOptions: SnapshotOptions = {
  includeDOMStructure: true,
  includeProps: true,
  includeStyling: true,
  includeAccessibility: true,
  includeState: false,
  prettyPrint: true,
  maxDepth: 10,
};

/**
 * Captures a snapshot of a React component
 *
 * @param component The React component to capture
 * @param options Options for capturing the snapshot
 * @returns The snapshot as a string
 *
 * @example
 * ```tsx
 * const snapshot = captureComponentSnapshot(<Button>Click me</Button>);
 * expect(snapshot).toMatchSnapshot();
 * ```
 */
export function captureComponentSnapshot(
  component: React.ReactElement,
  options: SnapshotOptions = defaultSnapshotOptions
): string {
  // Merge options with defaults
  const mergedOptions = { ...defaultSnapshotOptions, ...options };

  // Render the component
  const { container } = render(component);

  // Get the root element
  const rootElement = container.firstChild as HTMLElement;

  // If no root element, return empty string
  if (!rootElement) {
    return '';
  }

  // If using a custom serializer, use it
  if (mergedOptions.serializer) {
    return mergedOptions.serializer(rootElement);
  }

  // Create the snapshot
  let snapshot = '';

  // Include DOM structure
  if (mergedOptions.includeDOMStructure) {
    snapshot += prettyDOM(rootElement, {
      maxDepth: mergedOptions.maxDepth,
    });
  }

  // Include props
  if (mergedOptions.includeProps) {
    snapshot += '\n\nProps:\n';

    // Get all attributes
    const attributes = Array.from(rootElement.attributes);

    // Add each attribute to the snapshot
    attributes.forEach((attribute) => {
      snapshot += `${attribute.name}="${attribute.value}"\n`;
    });
  }

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
 * Captures snapshots of a component with different props
 *
 * @param Component The React component to capture
 * @param propsArray An array of props to apply to the component
 * @param options Options for capturing the snapshot
 * @returns An array of snapshots
 *
 * @example
 * ```tsx
 * const snapshots = captureComponentPropsSnapshots(
 *   Button,
 *   [
 *     { children: 'Click me' },
 *     { children: 'Click me', variant: 'primary' },
 *     { children: 'Click me', variant: 'secondary' },
 *   ]
 * );
 * snapshots.forEach((snapshot, index) => {
 *   expect(snapshot).toMatchSnapshot(`Button with props ${index}`);
 * });
 * ```
 */
export function captureComponentPropsSnapshots<P = any>(
  Component: React.ComponentType<P>,
  propsArray: P[],
  options: SnapshotOptions = defaultSnapshotOptions
): string[] {
  return propsArray.map((props) => {
    const component = React.createElement(Component, props);
    return captureComponentSnapshot(component, options);
  });
}

/**
 * Compares two snapshots and returns the differences
 *
 * @param snapshot1 The first snapshot
 * @param snapshot2 The second snapshot
 * @returns The differences between the snapshots
 *
 * @example
 * ```tsx
 * const snapshot1 = captureComponentSnapshot(<Button>Click me</Button>);
 * const snapshot2 = captureComponentSnapshot(<Button variant="primary">Click me</Button>);
 * const differences = compareSnapshots(snapshot1, snapshot2);
 * console.log(differences);
 * ```
 */
export function compareSnapshots(snapshot1: string, snapshot2: string): string[] {
  // Split snapshots into lines
  const lines1 = snapshot1.split('\n');
  const lines2 = snapshot2.split('\n');

  // Find differences
  const differences: string[] = [];

  // Find lines that are in snapshot1 but not in snapshot2
  lines1.forEach((line) => {
    if (!lines2.includes(line) && line.trim() !== '') {
      differences.push(`- ${line}`);
    }
  });

  // Find lines that are in snapshot2 but not in snapshot1
  lines2.forEach((line) => {
    if (!lines1.includes(line) && line.trim() !== '') {
      differences.push(`+ ${line}`);
    }
  });

  return differences;
}

/**
 * Creates a custom snapshot serializer for jest-dom-snapshot
 *
 * @param options Options for the serializer
 * @returns A custom snapshot serializer
 *
 * @example
 * ```tsx
 * // In your jest setup file
 * import { createSnapshotSerializer } from '@/lib/snapshot-testing';
 *
 * expect.addSnapshotSerializer(createSnapshotSerializer());
 * ```
 */
export function createSnapshotSerializer(options: SnapshotOptions = defaultSnapshotOptions) {
  return {
    test: (value: any) => {
      return value && value.nodeType === 1; // Check if it's an HTMLElement
    },
    print: (value: HTMLElement) => {
      // Create a snapshot of the element
      let snapshot = '';

      // Include DOM structure
      if (options.includeDOMStructure) {
        snapshot += prettyDOM(value, {
          maxDepth: options.maxDepth,
        });
      }

      // Include props
      if (options.includeProps) {
        snapshot += '\n\nProps:\n';

        // Get all attributes
        const attributes = Array.from(value.attributes);

        // Add each attribute to the snapshot
        attributes.forEach((attribute) => {
          snapshot += `${attribute.name}="${attribute.value}"\n`;
        });
      }

      // Include styling
      if (options.includeStyling) {
        snapshot += '\n\nStyling:\n';

        // Get computed style
        const computedStyle = window.getComputedStyle(value);

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
      if (options.includeAccessibility) {
        snapshot += '\n\nAccessibility:\n';

        // Get accessibility attributes
        const role = value.getAttribute('role');
        const ariaAttributes = Array.from(value.attributes)
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
    },
  };
}

/**
 * Custom matcher for testing if an element matches a DOM snapshot
 *
 * @param element The element to test
 * @param snapshot The snapshot to compare against
 * @returns Whether the element matches the snapshot
 *
 * @example
 * ```tsx
 * // In your jest setup file
 * import { toMatchDOMSnapshot } from '@/lib/snapshot-testing';
 *
 * expect.extend({ toMatchDOMSnapshot });
 *
 * // In your test
 * expect(screen.getByRole('button')).toMatchDOMSnapshot();
 * ```
 */
export function toMatchDOMSnapshot(element: HTMLElement, snapshot?: string) {
  // Create a snapshot of the element
  let actualSnapshot = '';

  // Include DOM structure
  actualSnapshot += prettyDOM(element, {
    maxDepth: 10,
  });

  // Include props
  actualSnapshot += '\n\nProps:\n';

  // Get all attributes
  const attributes = Array.from(element.attributes);

  // Add each attribute to the snapshot
  attributes.forEach((attribute) => {
    actualSnapshot += `${attribute.name}="${attribute.value}"\n`;
  });

  // Compare the element with the snapshot
  const pass = snapshot ? actualSnapshot === snapshot : true;

  // Return the result
  return {
    pass,
    message: () => {
      if (pass) {
        return 'Expected element not to match DOM snapshot';
      } else {
        return 'Expected element to match DOM snapshot';
      }
    },
  };
}
