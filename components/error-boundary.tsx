"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  testId?: string;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Enhanced Error Boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => <CustomErrorFallback error={error} onReset={reset} />}
 *   onError={(error, errorInfo) => logErrorToService(error, errorInfo)}
 *   componentName="ProductList"
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentName, onError } = this.props;

    // Log the error with component context if available
    console.error(
      `Error in ${componentName || "component"}:`,
      error,
      errorInfo
    );

    // Call the onError callback if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset the error state if props have changed and resetOnPropsChange is true
    if (
      this.state.hasError &&
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.handleReset();
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    const { hasError, error } = this.state;
    const { children, fallback, testId, componentName } = this.props;

    if (hasError && error) {
      // If a custom fallback is provided, use it
      if (fallback) {
        if (typeof fallback === "function") {
          return fallback(error, this.handleReset);
        }
        return fallback;
      }

      // Default fallback UI with component name if provided
      return (
        <div
          className="flex flex-col p-6 rounded-lg border bg-background shadow-sm space-y-4"
          data-testid={testId || "error-boundary"}
        >
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>
              {componentName
                ? `Error in ${componentName}`
                : "Something went wrong"
              }
            </AlertTitle>
            <AlertDescription>
              <p className="text-sm text-muted-foreground my-2">
                {error.message || "An unexpected error occurred"}
              </p>
              <Button
                onClick={this.handleReset}
                variant="outline"
                size="sm"
                className="mt-2 flex items-center gap-2"
                data-testid="error-boundary-retry"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return children;
  }
}

/**
 * Enhanced error fallback component with more customization options
 */
export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  showErrorDetails = true,
  className = "",
  testId = "error-fallback"
}: {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  showErrorDetails?: boolean;
  className?: string;
  testId?: string;
}) {
  return (
    <div
      className={`flex flex-col p-6 rounded-lg border bg-background shadow-sm space-y-4 ${className}`}
      data-testid={testId}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {showErrorDetails && (
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred"}
          </p>
        )}
      </div>
      <Button
        onClick={resetErrorBoundary}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

/**
 * A hook that wraps a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ErrorBoundaryProps, "children"> = {}
): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || "Component";

  const ComponentWithErrorBoundary = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryProps} componentName={displayName}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}
