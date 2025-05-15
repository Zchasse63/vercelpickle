// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
    };
  },
  toHaveClass(received, className) {
    const pass = received && received.classList && received.classList.contains(className);
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have class ${className}`,
    };
  },
  toHaveAttribute(received, attr, value) {
    const hasAttr = received && received.hasAttribute && received.hasAttribute(attr);
    const attrValue = hasAttr ? received.getAttribute(attr) : undefined;
    const pass = hasAttr && (value === undefined || attrValue === value);
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have attribute ${attr}${value !== undefined ? ` with value ${value}` : ''}`,
    };
  },
  toBeDisabled(received) {
    const pass = received && received.disabled === true;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be disabled`,
    };
  },
  toHaveBeenCalledWith(...args) {
    const pass = this.equals(this.actual.mock.calls, args);
    return {
      pass,
      message: () => `expected ${this.actual} ${pass ? 'not ' : ''}to have been called with ${args}`,
    };
  },
  toHaveBeenCalled() {
    const pass = this.actual && this.actual.mock && this.actual.mock.calls.length > 0;
    return {
      pass,
      message: () => `expected ${this.actual} ${pass ? 'not ' : ''}to have been called`,
    };
  },
});

// Add string matchers to expect
expect.stringMatching = (expected) => expect.stringContaining(expected);

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
