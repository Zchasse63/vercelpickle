import { render, screen, fireEvent } from '@/lib/test-utils'
import { Input } from '@/components/ui/input'
import { AlertCircle, Loader2 } from 'lucide-react'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}))

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />)

    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex')
    expect(input).toHaveClass('w-full')
  })

  it('renders correctly with different variants', () => {
    // Default variant
    const { rerender } = render(<Input variant="default" placeholder="Default variant" />)
    let input = screen.getByPlaceholderText('Default variant')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-input')

    // Filled variant
    rerender(<Input variant="filled" placeholder="Filled variant" />)
    input = screen.getByPlaceholderText('Filled variant')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('bg-muted/50')

    // Outline variant
    rerender(<Input variant="outline" placeholder="Outline variant" />)
    input = screen.getByPlaceholderText('Outline variant')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-2')

    // Flushed variant
    rerender(<Input variant="flushed" placeholder="Flushed variant" />)
    input = screen.getByPlaceholderText('Flushed variant')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-b')
    expect(input).toHaveClass('rounded-none')
  })

  it('renders correctly with different sizes', () => {
    // Small size
    const { rerender } = render(<Input size="sm" placeholder="Small input" />)
    let input = screen.getByPlaceholderText('Small input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('h-8')

    // Medium size (default)
    rerender(<Input size="md" placeholder="Medium input" />)
    input = screen.getByPlaceholderText('Medium input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('h-10')

    // Large size
    rerender(<Input size="lg" placeholder="Large input" />)
    input = screen.getByPlaceholderText('Large input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('h-12')
  })

  it('renders correctly with different states', () => {
    // Default state
    const { rerender } = render(<Input state="default" placeholder="Default state" />)
    let input = screen.getByPlaceholderText('Default state')
    expect(input).toBeInTheDocument()

    // Error state
    rerender(<Input state="error" placeholder="Error state" />)
    input = screen.getByPlaceholderText('Error state')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-destructive')

    // Success state
    rerender(<Input state="success" placeholder="Success state" />)
    input = screen.getByPlaceholderText('Success state')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-green-500')
  })

  it('renders correctly with left icon', () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon" />}
        placeholder="Input with left icon"
      />
    )

    const input = screen.getByPlaceholderText('Input with left icon')
    const icon = screen.getByTestId('left-icon')

    expect(input).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(input).toHaveClass('pl-10')
  })

  it('renders correctly with right icon', () => {
    render(
      <Input
        rightIcon={<span data-testid="right-icon" />}
        placeholder="Input with right icon"
      />
    )

    const input = screen.getByPlaceholderText('Input with right icon')
    const icon = screen.getByTestId('right-icon')

    expect(input).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(input).toHaveClass('pr-10')
  })

  it('renders correctly with loading state', () => {
    render(
      <Input
        isLoading
        placeholder="Loading input"
      />
    )

    const input = screen.getByPlaceholderText('Loading input')
    const loader = screen.getByTestId('loader-icon')

    expect(input).toBeInTheDocument()
    expect(loader).toBeInTheDocument()
    expect(input).toBeDisabled()
    expect(input).toHaveClass('pr-10')
  })

  it('renders correctly with error state and message', () => {
    render(
      <Input
        isError
        errorMessage="This field is required"
        placeholder="Error input"
      />
    )

    const input = screen.getByPlaceholderText('Error input')
    const errorIcon = screen.getByTestId('alert-icon')
    const errorMessage = screen.getByText('This field is required')

    expect(input).toBeInTheDocument()
    expect(errorIcon).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it.skip('renders correctly with helper text', () => {
    render(
      <Input
        helperText="This is a helper text"
        placeholder="Input with helper"
      />
    )

    const input = screen.getByPlaceholderText('Input with helper')
    const helperText = screen.getByText('This is a helper text')

    expect(input).toBeInTheDocument()
    expect(helperText).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-helper'))
  })

  it('handles user input correctly', () => {
    render(<Input placeholder="Type here" />)

    const input = screen.getByPlaceholderText('Type here')
    fireEvent.change(input, { target: { value: 'Hello, world!' } })

    expect(input).toHaveValue('Hello, world!')
  })

  it('calls onChange handler when input changes', () => {
    const handleChange = jest.fn()
    render(<Input placeholder="Type here" onChange={handleChange} />)

    const input = screen.getByPlaceholderText('Type here')
    fireEvent.change(input, { target: { value: 'Hello, world!' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it.skip('does not allow input when disabled', () => {
    render(<Input placeholder="Disabled input" disabled />)

    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()

    fireEvent.change(input, { target: { value: 'Hello, world!' } })
    expect(input).not.toHaveValue('Hello, world!')
  })

  it.skip('does not allow input when loading', () => {
    render(<Input placeholder="Loading input" isLoading />)

    const input = screen.getByPlaceholderText('Loading input')
    expect(input).toBeDisabled()

    fireEvent.change(input, { target: { value: 'Hello, world!' } })
    expect(input).not.toHaveValue('Hello, world!')
  })

  it('prioritizes error message over helper text', () => {
    render(
      <Input
        isError
        errorMessage="This field is required"
        helperText="This is a helper text"
        placeholder="Input with error"
      />
    )

    const input = screen.getByPlaceholderText('Input with error')
    const errorMessage = screen.getByText('This field is required')

    expect(input).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
    expect(screen.queryByText('This is a helper text')).not.toBeInTheDocument()
  })

  it('renders correctly with different input types', () => {
    // Text type (default)
    const { rerender } = render(<Input type="text" placeholder="Text input" />)
    let input = screen.getByPlaceholderText('Text input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')

    // Password type
    rerender(<Input type="password" placeholder="Password input" />)
    input = screen.getByPlaceholderText('Password input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')

    // Email type
    rerender(<Input type="email" placeholder="Email input" />)
    input = screen.getByPlaceholderText('Email input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'email')

    // Number type
    rerender(<Input type="number" placeholder="Number input" />)
    input = screen.getByPlaceholderText('Number input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'number')
  })
})
