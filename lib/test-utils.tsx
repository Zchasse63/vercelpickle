import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock Radix UI Slot component for testing
jest.mock('@radix-ui/react-slot', () => {
  return {
    Slot: ({ children, ...props }: { children: React.ReactNode } & Record<string, any>) => {
      // Get the first child element
      const childArray = React.Children.toArray(children);
      if (childArray.length === 0) return null;

      const firstChild = childArray[0] as React.ReactElement;

      // Clone the element with the props
      return React.cloneElement(firstChild, {
        ...firstChild.props,
        ...props,
        // Merge event handlers
        ...Object.entries(props).reduce((acc, [key, value]) => {
          if (key.startsWith('on') && firstChild.props[key]) {
            acc[key] = (event: any) => {
              firstChild.props[key](event);
              if (!event.defaultPrevented) {
                (value as Function)(event);
              }
            };
          }
          return acc;
        }, {} as Record<string, any>),
      });
    }
  };
});

// Add in any providers here if needed
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Providers, ...options }),
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render method
export { customRender as render }
