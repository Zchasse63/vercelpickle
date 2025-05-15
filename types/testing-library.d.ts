import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeDisabled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenCalled(): R;
    }

    interface Expect {
      stringMatching(expected: string | RegExp): any;
    }
  }
}

// Add matchers to chai
declare namespace Chai {
  interface Assertion {
    toBeInTheDocument(): Assertion;
    toHaveClass(className: string): Assertion;
    toHaveAttribute(attr: string, value?: string): Assertion;
    toBeDisabled(): Assertion;
    toHaveBeenCalledWith(...args: any[]): Assertion;
    toHaveBeenCalled(): Assertion;
  }
}
