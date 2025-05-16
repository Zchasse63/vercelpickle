import { render, screen } from '@/lib/test-utils'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  it('renders correctly with default props', () => {
    render(<Badge>Default Badge</Badge>)
    
    // Check that the badge is rendered
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    
    // Check that the badge has the correct classes
    expect(badge).toHaveClass('inline-flex')
    expect(badge).toHaveClass('items-center')
    expect(badge).toHaveClass('rounded-full')
    expect(badge).toHaveClass('border')
    expect(badge).toHaveClass('px-2.5')
    expect(badge).toHaveClass('py-0.5')
    expect(badge).toHaveClass('text-xs')
    expect(badge).toHaveClass('font-semibold')
    expect(badge).toHaveClass('transition-colors')
    
    // Check that the badge has the default variant classes
    expect(badge).toHaveClass('bg-primary')
    expect(badge).toHaveClass('text-primary-foreground')
    expect(badge).toHaveClass('hover:bg-primary/80')
  })

  it('renders correctly with custom className', () => {
    render(<Badge className="custom-badge">Custom Badge</Badge>)
    
    // Check that the badge has the custom class
    const badge = screen.getByText('Custom Badge')
    expect(badge).toHaveClass('custom-badge')
  })

  it('renders correctly with different variants', () => {
    // Test default variant
    const { rerender } = render(<Badge variant="default">Default Badge</Badge>)
    
    let badge = screen.getByText('Default Badge')
    expect(badge).toHaveClass('bg-primary')
    expect(badge).toHaveClass('text-primary-foreground')
    expect(badge).toHaveClass('hover:bg-primary/80')
    
    // Test secondary variant
    rerender(<Badge variant="secondary">Secondary Badge</Badge>)
    
    badge = screen.getByText('Secondary Badge')
    expect(badge).toHaveClass('bg-secondary')
    expect(badge).toHaveClass('text-secondary-foreground')
    expect(badge).toHaveClass('hover:bg-secondary/80')
    
    // Test destructive variant
    rerender(<Badge variant="destructive">Destructive Badge</Badge>)
    
    badge = screen.getByText('Destructive Badge')
    expect(badge).toHaveClass('bg-destructive')
    expect(badge).toHaveClass('text-destructive-foreground')
    expect(badge).toHaveClass('hover:bg-destructive/80')
    
    // Test outline variant
    rerender(<Badge variant="outline">Outline Badge</Badge>)
    
    badge = screen.getByText('Outline Badge')
    expect(badge).toHaveClass('bg-transparent')
    expect(badge).toHaveClass('text-foreground')
    expect(badge).toHaveClass('hover:bg-muted')
    
    // Test success variant
    rerender(<Badge variant="success">Success Badge</Badge>)
    
    badge = screen.getByText('Success Badge')
    expect(badge).toHaveClass('bg-green-500')
    expect(badge).toHaveClass('text-white')
    expect(badge).toHaveClass('hover:bg-green-500/80')
    
    // Test warning variant
    rerender(<Badge variant="warning">Warning Badge</Badge>)
    
    badge = screen.getByText('Warning Badge')
    expect(badge).toHaveClass('bg-yellow-500')
    expect(badge).toHaveClass('text-white')
    expect(badge).toHaveClass('hover:bg-yellow-500/80')
    
    // Test info variant
    rerender(<Badge variant="info">Info Badge</Badge>)
    
    badge = screen.getByText('Info Badge')
    expect(badge).toHaveClass('bg-blue-500')
    expect(badge).toHaveClass('text-white')
    expect(badge).toHaveClass('hover:bg-blue-500/80')
  })

  it('renders correctly with different sizes', () => {
    // Test small size
    const { rerender } = render(<Badge size="sm">Small Badge</Badge>)
    
    let badge = screen.getByText('Small Badge')
    expect(badge).toHaveClass('text-xs')
    expect(badge).toHaveClass('px-2')
    expect(badge).toHaveClass('py-0.5')
    
    // Test medium size (default)
    rerender(<Badge size="md">Medium Badge</Badge>)
    
    badge = screen.getByText('Medium Badge')
    expect(badge).toHaveClass('text-xs')
    expect(badge).toHaveClass('px-2.5')
    expect(badge).toHaveClass('py-0.5')
    
    // Test large size
    rerender(<Badge size="lg">Large Badge</Badge>)
    
    badge = screen.getByText('Large Badge')
    expect(badge).toHaveClass('text-sm')
    expect(badge).toHaveClass('px-3')
    expect(badge).toHaveClass('py-1')
  })

  it('renders correctly with different shapes', () => {
    // Test rounded shape (default)
    const { rerender } = render(<Badge shape="rounded">Rounded Badge</Badge>)
    
    let badge = screen.getByText('Rounded Badge')
    expect(badge).toHaveClass('rounded-full')
    
    // Test square shape
    rerender(<Badge shape="square">Square Badge</Badge>)
    
    badge = screen.getByText('Square Badge')
    expect(badge).toHaveClass('rounded-md')
  })

  it('renders correctly with asChild prop', () => {
    const CustomComponent = ({ children, ...props }: React.ComponentProps<'span'>) => (
      <span data-testid="custom-component" {...props}>
        {children}
      </span>
    )
    
    render(
      <Badge asChild>
        <CustomComponent>Custom Badge</CustomComponent>
      </Badge>
    )
    
    // Check that the custom component is rendered
    const customComponent = screen.getByTestId('custom-component')
    expect(customComponent).toBeInTheDocument()
    expect(customComponent).toHaveTextContent('Custom Badge')
    
    // Check that the badge classes are applied to the custom component
    expect(customComponent).toHaveClass('bg-primary')
    expect(customComponent).toHaveClass('text-primary-foreground')
  })

  it('passes additional props to the badge', () => {
    render(
      <Badge data-testid="badge-test" aria-label="Badge">
        Badge
      </Badge>
    )
    
    // Check that the additional props are passed to the badge
    const badge = screen.getByTestId('badge-test')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute('aria-label', 'Badge')
  })

  it('renders correctly with different colors', () => {
    // Test primary color (default)
    const { rerender } = render(<Badge color="primary">Primary Badge</Badge>)
    
    let badge = screen.getByText('Primary Badge')
    expect(badge).toHaveClass('bg-primary')
    expect(badge).toHaveClass('text-primary-foreground')
    
    // Test secondary color
    rerender(<Badge color="secondary">Secondary Badge</Badge>)
    
    badge = screen.getByText('Secondary Badge')
    expect(badge).toHaveClass('bg-secondary')
    expect(badge).toHaveClass('text-secondary-foreground')
    
    // Test accent color
    rerender(<Badge color="accent">Accent Badge</Badge>)
    
    badge = screen.getByText('Accent Badge')
    expect(badge).toHaveClass('bg-accent')
    expect(badge).toHaveClass('text-accent-foreground')
    
    // Test muted color
    rerender(<Badge color="muted">Muted Badge</Badge>)
    
    badge = screen.getByText('Muted Badge')
    expect(badge).toHaveClass('bg-muted')
    expect(badge).toHaveClass('text-muted-foreground')
    
    // Test brand color
    rerender(<Badge color="brand">Brand Badge</Badge>)
    
    badge = screen.getByText('Brand Badge')
    expect(badge).toHaveClass('bg-pickle-green')
    expect(badge).toHaveClass('text-white')
  })
})
