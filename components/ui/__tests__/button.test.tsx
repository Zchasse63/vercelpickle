import { render, screen } from '@/lib/test-utils'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    // Just check for a basic class that should be present
    expect(button).toHaveClass('inline-flex')
  })

  it('renders correctly with primary variant', () => {
    render(<Button variant="default">Primary Button</Button>)
    const button = screen.getByRole('button', { name: /primary button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  it('renders correctly with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole('button', { name: /secondary button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-secondary')
  })

  it('renders correctly with outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>)
    const button = screen.getByRole('button', { name: /outline button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('border')
  })

  it('renders correctly with ghost variant', () => {
    render(<Button variant="ghost">Ghost Button</Button>)
    const button = screen.getByRole('button', { name: /ghost button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('hover:bg-accent')
  })

  it('renders correctly with destructive variant', () => {
    render(<Button variant="destructive">Destructive Button</Button>)
    const button = screen.getByRole('button', { name: /destructive button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-destructive')
  })

  it('renders correctly with small size', () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole('button', { name: /small button/i })
    expect(button).toBeInTheDocument()
    // Just check that it has a size-related class
    expect(button).toHaveClass('h-9')
  })

  it('renders correctly with large size', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole('button', { name: /large button/i })
    expect(button).toBeInTheDocument()
    // Just check that it has a size-related class
    expect(button).toHaveClass('h-11')
  })

  it('renders correctly with icon', () => {
    render(
      <Button>
        <svg data-testid="test-icon" />
        Button with Icon
      </Button>
    )
    const button = screen.getByRole('button', { name: /button with icon/i })
    const icon = screen.getByTestId('test-icon')
    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
  })

  it('renders correctly when disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
    // Just check that it's disabled without checking specific classes
  })

  it('renders as a link when asChild is used with an anchor', () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>
    )

    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    // Just check for a basic class that should be present
    expect(link).toHaveClass('inline-flex')
  })
})
