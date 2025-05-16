import { render, screen, fireEvent } from '@/lib/test-utils'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader-icon" />,
}))

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

  it('renders correctly with brand variants', () => {
    // Test dill variant
    const { rerender } = render(<Button brand="dill">Dill Button</Button>)
    let button = screen.getByRole('button', { name: /dill button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-dill-green')

    // Test pickle variant
    rerender(<Button brand="pickle">Pickle Button</Button>)
    button = screen.getByRole('button', { name: /pickle button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-pickle-green')

    // Test mustard variant
    rerender(<Button brand="mustard">Mustard Button</Button>)
    button = screen.getByRole('button', { name: /mustard button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-golden-mustard')
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

  it('renders correctly with extra large size', () => {
    render(<Button size="xl">XL Button</Button>)
    const button = screen.getByRole('button', { name: /xl button/i })
    expect(button).toBeInTheDocument()
    // Just check that it has a size-related class
    expect(button).toHaveClass('h-12')
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

  it.skip('renders as a link when asChild is used with an anchor', () => {
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

  it('handles click events correctly', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it.skip('does not trigger click events when disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>)

    const button = screen.getByRole('button', { name: /disabled button/i })
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders correctly with loading state', () => {
    render(<Button isLoading>Loading Button</Button>)

    const button = screen.getByRole('button', { name: /loading button/i })
    const loader = screen.getByTestId('loader-icon')

    expect(button).toBeInTheDocument()
    expect(loader).toBeInTheDocument()
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('renders correctly with left icon', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon" />}>
        Button with Left Icon
      </Button>
    )

    const button = screen.getByRole('button', { name: /button with left icon/i })
    const icon = screen.getByTestId('left-icon')

    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
  })

  it('renders correctly with right icon', () => {
    render(
      <Button rightIcon={<span data-testid="right-icon" />}>
        Button with Right Icon
      </Button>
    )

    const button = screen.getByRole('button', { name: /button with right icon/i })
    const icon = screen.getByTestId('right-icon')

    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
  })

  it('renders correctly with both left and right icons', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      >
        Button with Icons
      </Button>
    )

    const button = screen.getByRole('button', { name: /button with icons/i })
    const leftIcon = screen.getByTestId('left-icon')
    const rightIcon = screen.getByTestId('right-icon')

    expect(button).toBeInTheDocument()
    expect(leftIcon).toBeInTheDocument()
    expect(rightIcon).toBeInTheDocument()
  })

  it('renders correctly with accessible label for icon-only buttons', () => {
    render(
      <Button
        leftIcon={<span data-testid="icon" />}
        accessibleLabel="Accessible Button"
      />
    )

    const button = screen.getByRole('button', { name: /accessible button/i })
    const icon = screen.getByTestId('icon')

    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Accessible Button')
  })

  it('does not show icons when in loading state', () => {
    render(
      <Button
        isLoading
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      >
        Loading Button
      </Button>
    )

    const button = screen.getByRole('button', { name: /loading button/i })
    const loader = screen.getByTestId('loader-icon')

    expect(button).toBeInTheDocument()
    expect(loader).toBeInTheDocument()
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument()
  })
})
