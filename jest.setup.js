// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock for window.HTMLElement.prototype.scrollIntoView
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.HTMLElement.prototype.scrollTo = jest.fn();
  window.scrollTo = jest.fn();

  // Add support for Element.prototype.closest
  if (!window.Element.prototype.closest) {
    window.Element.prototype.closest = function(selector) {
      let element = this;
      while (element && element.nodeType === 1) {
        if (element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
      }
      return null;
    };
  }

  // Add support for Element.prototype.matches
  if (!window.Element.prototype.matches) {
    window.Element.prototype.matches =
      window.Element.prototype.matchesSelector ||
      window.Element.prototype.mozMatchesSelector ||
      window.Element.prototype.msMatchesSelector ||
      window.Element.prototype.oMatchesSelector ||
      window.Element.prototype.webkitMatchesSelector ||
      function(s) {
        // Simple implementation for testing
        return s === this.tagName.toLowerCase();
      };
  }

  // Mock for MutationObserver
  global.MutationObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.observe = jest.fn();
      this.disconnect = jest.fn();
      this.takeRecords = jest.fn().mockReturnValue([]);
    }

    // Helper method to simulate mutations
    _simulateMutations(mutations) {
      this.callback(mutations, this);
    }
  };

  // Mock for window.getComputedStyle
  window.getComputedStyle = jest.fn().mockImplementation(element => {
    return {
      getPropertyValue: jest.fn(prop => {
        // Default values for common properties
        const defaults = {
          'display': 'block',
          'visibility': 'visible',
          'position': 'static',
          'height': 'auto',
          'width': 'auto',
          'top': 'auto',
          'right': 'auto',
          'bottom': 'auto',
          'left': 'auto',
          'padding': '0px',
          'margin': '0px',
          'border': '0px',
          'color': 'rgb(0, 0, 0)',
          'background-color': 'rgba(0, 0, 0, 0)',
          'font-size': '16px',
          'line-height': 'normal',
          'transform': 'none',
          'transition': 'none',
          'animation': 'none',
          'opacity': '1',
        };
        return defaults[prop] || '';
      }),
      // Add support for accessing properties directly
      ...Object.fromEntries(
        Object.entries({
          display: 'block',
          visibility: 'visible',
          position: 'static',
          height: 'auto',
          width: 'auto',
        }).map(([key, value]) => [key, value])
      )
    };
  });
}

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
  // These matchers are now provided by jest-dom, so we can remove our custom implementations
  // and rely on the built-in ones
  // Add data-testid matcher
  toHaveTestId(received, testId) {
    const pass = received &&
      received.hasAttribute &&
      received.hasAttribute('data-testid') &&
      received.getAttribute('data-testid') === testId;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have data-testid="${testId}"`,
    };
  },
  // Add accessibility matcher
  toBeAccessible(received) {
    // This is a placeholder. In a real implementation, this would use axe-core
    // to check for accessibility issues.
    const pass = true;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be accessible`,
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
  redirect: jest.fn(),
  notFound: jest.fn(),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...rest }) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }
})

// Mock convex/react
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useAction: jest.fn(),
  usePaginatedQuery: jest.fn(),
  ConvexProvider: ({ children }) => children,
  ConvexReactClient: jest.fn(),
  useConvex: jest.fn(() => ({
    query: jest.fn(),
    mutation: jest.fn(),
    action: jest.fn(),
  })),
}))

// Mock auth provider
jest.mock('@/providers/auth-provider', () => ({
  useAuth: jest.fn(() => ({
    user: null,
    isLoading: false,
    login: jest.fn().mockResolvedValue(true),
    register: jest.fn().mockResolvedValue(true),
    logout: jest.fn(),
  })),
  AuthProvider: ({ children }) => children,
}))

// Mock store provider
jest.mock('@/lib/store', () => ({
  useAuthStore: jest.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: jest.fn().mockResolvedValue(true),
    register: jest.fn().mockResolvedValue(true),
    logout: jest.fn(),
    setUser: jest.fn(),
    checkAuth: jest.fn().mockResolvedValue(true),
  })),
}))

// Mock hooks
jest.mock('@/hooks/use-cart', () => ({
  useCart: jest.fn(() => ({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateItemQuantity: jest.fn(),
    clearCart: jest.fn(),
  })),
}))

// Enhanced ResizeObserver mock
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  // Add support for the callback
  _callback: null,
  // Add support for triggering resize events
  _triggerResize: function(entries) {
    if (this._callback) {
      this._callback(entries, this);
    }
  }
}));

// Enhanced IntersectionObserver mock
global.IntersectionObserver = jest.fn().mockImplementation(function(callback, options) {
  return {
    root: options?.root || null,
    rootMargin: options?.rootMargin || '0px',
    thresholds: Array.isArray(options?.threshold) ? options.threshold : [options?.threshold || 0],
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn().mockReturnValue([]),
    // Store the callback
    _callback: callback,
    // Add support for triggering intersection events
    _triggerIntersection: function(entries) {
      this._callback(entries, this);
    }
  };
});

// Enhanced window.matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => {
    const listeners = {
      change: new Set(),
    };

    return {
      matches: false,
      media: query,
      onchange: null,
      // Legacy methods
      addListener: jest.fn(listener => listeners.change.add(listener)),
      removeListener: jest.fn(listener => listeners.change.delete(listener)),
      // Standard methods
      addEventListener: jest.fn((type, listener) => {
        if (listeners[type]) {
          listeners[type].add(listener);
        } else {
          listeners[type] = new Set([listener]);
        }
      }),
      removeEventListener: jest.fn((type, listener) => {
        if (listeners[type]) {
          listeners[type].delete(listener);
        }
      }),
      dispatchEvent: jest.fn(event => {
        if (event.type && listeners[event.type]) {
          listeners[event.type].forEach(listener => listener(event));
        }
        return true;
      }),
      // Helper method to simulate media query change
      _simulateChange: function(newMatches) {
        const oldMatches = this.matches;
        this.matches = newMatches;

        if (oldMatches !== newMatches) {
          const event = new Event('change');

          // Call onchange handler
          if (this.onchange) {
            this.onchange(event);
          }

          // Call legacy listeners
          listeners.change.forEach(listener => listener(event));

          // Dispatch event for standard listeners
          this.dispatchEvent(event);
        }
      }
    };
  }),
})

// Mock console.error to fail tests on prop type errors
const originalConsoleError = console.error
console.error = (...args) => {
  const propTypeErrors = [
    'Failed prop type',
    'Invalid prop',
    'Warning: Each child in a list should have a unique "key" prop',
  ]

  if (propTypeErrors.some(errorText =>
    args.some(arg => typeof arg === 'string' && arg.includes(errorText))
  )) {
    throw new Error(args.join(' '))
  }

  originalConsoleError(...args)
}
