import React from 'react';
import {
  renderWithTestId,
  testComponentVariants,
  testComponentSizes,
  testComponentStates,
  testComponentEvents,
  fireEvent
} from '@/lib/test-utils-extended';
import { Button } from '@/components/ui/button';

describe('Button Component (Extended Tests)', () => {
  it('renders correctly with enhanced test utilities', () => {
    const { getByTestIdOrFail } = renderWithTestId(
      <Button data-testid="test-button">Click me</Button>
    );

    const button = getByTestIdOrFail('test-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('renders correctly with different variants', () => {
    testComponentVariants(
      Button,
      'variant',
      ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      {
        default: ['bg-primary', 'text-primary-foreground'],
        destructive: ['bg-destructive', 'text-destructive-foreground'],
        outline: ['border', 'border-input'],
        secondary: ['bg-secondary', 'text-secondary-foreground'],
        ghost: ['hover:bg-accent'],
        link: ['text-primary', 'underline-offset-4']
      }
    );
  });

  it('renders correctly with different sizes', () => {
    testComponentSizes(
      Button,
      'size',
      ['default', 'sm', 'lg', 'icon'],
      {
        default: ['h-10', 'px-4', 'py-2'],
        sm: ['h-9', 'px-3'],
        lg: ['h-11', 'px-8'],
        icon: ['h-10', 'w-10']
      }
    );
  });

  it('renders correctly with different states', () => {
    testComponentStates(
      Button,
      [
        {
          name: 'disabled',
          props: { disabled: true },
          expectedClassNames: ['disabled:opacity-50', 'disabled:pointer-events-none'],
          expectedAttributes: { 'disabled': '' }
        },
        {
          name: 'loading',
          props: { isLoading: true },
          expectedClassNames: ['disabled:pointer-events-none'],
          expectedAttributes: { 'aria-busy': 'true' }
        }
      ]
    );
  });

  it('handles events correctly', () => {
    testComponentEvents(
      Button,
      [
        {
          name: 'click',
          handlerProp: 'onClick',
          action: (element) => {
            fireEvent.click(element);
          }
        }
      ]
    );
  });
});
