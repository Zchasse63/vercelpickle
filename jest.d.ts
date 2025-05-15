// Type definitions for Jest
// This file extends the Jest types to include custom matchers

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
  }
}

declare namespace jest {
  interface Expect {
    stringMatching(expected: string | RegExp): any;
  }
}

export {};
