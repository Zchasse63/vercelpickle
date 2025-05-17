import { render, screen } from '@/lib/test-utils'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Info: () => <div data-testid="info-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
}))

describe('Alert Component', () => {
  it('renders correctly with default props', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert Description</AlertDescription>
      </Alert>
    )
    
    // Check that the alert is rendered
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    
    // Check that the alert has the correct classes
    expect(alert).toHaveClass('relative')
    expect(alert).toHaveClass('w-full')
    expect(alert).toHaveClass('rounded-lg')
    expect(alert).toHaveClass('border')
    expect(alert).toHaveClass('p-4')
    
    // Check that the title and description are rendered
    expect(screen.getByText('Alert Title')).toBeInTheDocument()
    expect(screen.getByText('Alert Description')).toBeInTheDocument()
  })

  it('renders correctly with custom className', () => {
    render(
      <Alert className="custom-alert">
        <AlertTitle className="custom-title">Alert Title</AlertTitle>
        <AlertDescription className="custom-description">Alert Description</AlertDescription>
      </Alert>
    )
    
    // Check that the alert has the custom class
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('custom-alert')
    
    // Check that the title has the custom class
    const title = screen.getByText('Alert Title')
    expect(title).toHaveClass('custom-title')
    
    // Check that the description has the custom class
    const description = screen.getByText('Alert Description')
    expect(description).toHaveClass('custom-description')
  })

  it('renders correctly with different variants', () => {
    // Test default variant
    const { rerender } = render(
      <Alert variant="default">
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>Default Alert Description</AlertDescription>
      </Alert>
    )
    
    let alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-background')
    expect(alert).toHaveClass('text-foreground')
    
    // Test destructive variant
    rerender(
      <Alert variant="destructive">
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>Destructive Alert Description</AlertDescription>
      </Alert>
    )
    
    alert = screen.getByRole('alert')
    expect(alert).toHaveClass('border-destructive/50')
    expect(alert).toHaveClass('text-destructive')
    expect(alert).toHaveClass('dark:border-destructive')
    
    // Test success variant
    rerender(
      <Alert variant="success">
        <AlertTitle>Success Alert</AlertTitle>
        <AlertDescription>Success Alert Description</AlertDescription>
      </Alert>
    )
    
    alert = screen.getByRole('alert')
    expect(alert).toHaveClass('border-green-500/50')
    expect(alert).toHaveClass('text-green-500')
    expect(alert).toHaveClass('dark:border-green-500')
    
    // Test warning variant
    rerender(
      <Alert variant="warning">
        <AlertTitle>Warning Alert</AlertTitle>
        <AlertDescription>Warning Alert Description</AlertDescription>
      </Alert>
    )
    
    alert = screen.getByRole('alert')
    expect(alert).toHaveClass('border-yellow-500/50')
    expect(alert).toHaveClass('text-yellow-500')
    expect(alert).toHaveClass('dark:border-yellow-500')
    
    // Test info variant
    rerender(
      <Alert variant="info">
        <AlertTitle>Info Alert</AlertTitle>
        <AlertDescription>Info Alert Description</AlertDescription>
      </Alert>
    )
    
    alert = screen.getByRole('alert')
    expect(alert).toHaveClass('border-blue-500/50')
    expect(alert).toHaveClass('text-blue-500')
    expect(alert).toHaveClass('dark:border-blue-500')
  })

  it('renders correctly with icons', () => {
    // Test default variant with icon
    const { rerender } = render(
      <Alert variant="default" icon={AlertCircle}>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>Default Alert Description</AlertDescription>
      </Alert>
    )
    
    // Check that the icon is rendered
    expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument()
    
    // Test destructive variant with icon
    rerender(
      <Alert variant="destructive" icon={AlertCircle}>
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>Destructive Alert Description</AlertDescription>
      </Alert>
    )
    
    // Check that the icon is rendered
    expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument()
    
    // Test success variant with icon
    rerender(
      <Alert variant="success" icon={CheckCircle}>
        <AlertTitle>Success Alert</AlertTitle>
        <AlertDescription>Success Alert Description</AlertDescription>
      </Alert>
    )
    
    // Check that the icon is rendered
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument()
    
    // Test warning variant with icon
    rerender(
      <Alert variant="warning" icon={AlertTriangle}>
        <AlertTitle>Warning Alert</AlertTitle>
        <AlertDescription>Warning Alert Description</AlertDescription>
      </Alert>
    )
    
    // Check that the icon is rendered
    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument()
    
    // Test info variant with icon
    rerender(
      <Alert variant="info" icon={Info}>
        <AlertTitle>Info Alert</AlertTitle>
        <AlertDescription>Info Alert Description</AlertDescription>
      </Alert>
    )
    
    // Check that the icon is rendered
    expect(screen.getByTestId('info-icon')).toBeInTheDocument()
  })

  it('renders correctly with only title', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
      </Alert>
    )
    
    // Check that the alert is rendered
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    
    // Check that the title is rendered
    expect(screen.getByText('Alert Title')).toBeInTheDocument()
    
    // Check that the description is not rendered
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders correctly with only description', () => {
    render(
      <Alert>
        <AlertDescription>Alert Description</AlertDescription>
      </Alert>
    )
    
    // Check that the alert is rendered
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    
    // Check that the description is rendered
    expect(screen.getByText('Alert Description')).toBeInTheDocument()
    
    // Check that the title is not rendered
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('passes additional props to alert components', () => {
    render(
      <Alert data-testid="alert-test" aria-label="Alert">
        <AlertTitle data-testid="title-test">Alert Title</AlertTitle>
        <AlertDescription data-testid="description-test">Alert Description</AlertDescription>
      </Alert>
    )
    
    // Check that the additional props are passed to the components
    expect(screen.getByTestId('alert-test')).toBeInTheDocument()
    expect(screen.getByTestId('title-test')).toBeInTheDocument()
    expect(screen.getByTestId('description-test')).toBeInTheDocument()
    
    // Check that the aria-label is passed to the alert
    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-label', 'Alert')
  })
})
