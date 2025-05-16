import { render, screen, fireEvent } from '@/lib/test-utils'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle } from 'lucide-react'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
}))

describe('Textarea Component', () => {
  it('renders correctly with default props', () => {
    render(<Textarea placeholder="Enter text" />)

    const textarea = screen.getByPlaceholderText('Enter text')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('flex')
    expect(textarea).toHaveClass('min-h-[80px]')
    expect(textarea).toHaveClass('w-full')
    expect(textarea).toHaveClass('rounded-md')
    expect(textarea).toHaveClass('border')
    expect(textarea).toHaveClass('border-input')
    expect(textarea).toHaveClass('bg-background')
    expect(textarea).toHaveClass('px-3')
    expect(textarea).toHaveClass('py-2')
    expect(textarea).toHaveClass('text-sm')
  })

  it('renders correctly with different variants', () => {
    // Default variant
    const { rerender } = render(<Textarea variant="default" placeholder="Default variant" />)
    let textarea = screen.getByPlaceholderText('Default variant')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('border-input')

    // Filled variant
    rerender(<Textarea variant="filled" placeholder="Filled variant" />)
    textarea = screen.getByPlaceholderText('Filled variant')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('bg-muted/50')

    // Outline variant
    rerender(<Textarea variant="outline" placeholder="Outline variant" />)
    textarea = screen.getByPlaceholderText('Outline variant')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('border-2')

    // Flushed variant
    rerender(<Textarea variant="flushed" placeholder="Flushed variant" />)
    textarea = screen.getByPlaceholderText('Flushed variant')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('border-b')
    expect(textarea).toHaveClass('rounded-none')
  })

  it('renders correctly with different sizes', () => {
    // Small size
    const { rerender } = render(<Textarea size="sm" placeholder="Small textarea" />)
    let textarea = screen.getByPlaceholderText('Small textarea')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('text-xs')
    expect(textarea).toHaveClass('px-2')
    expect(textarea).toHaveClass('py-1')

    // Medium size (default)
    rerender(<Textarea size="md" placeholder="Medium textarea" />)
    textarea = screen.getByPlaceholderText('Medium textarea')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('text-sm')
    expect(textarea).toHaveClass('px-3')
    expect(textarea).toHaveClass('py-2')

    // Large size
    rerender(<Textarea size="lg" placeholder="Large textarea" />)
    textarea = screen.getByPlaceholderText('Large textarea')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('text-base')
    expect(textarea).toHaveClass('px-4')
    expect(textarea).toHaveClass('py-3')
  })

  it('renders correctly with different states', () => {
    // Default state
    const { rerender } = render(<Textarea state="default" placeholder="Default state" />)
    let textarea = screen.getByPlaceholderText('Default state')
    expect(textarea).toBeInTheDocument()

    // Error state
    rerender(<Textarea state="error" placeholder="Error state" />)
    textarea = screen.getByPlaceholderText('Error state')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('border-destructive')

    // Success state
    rerender(<Textarea state="success" placeholder="Success state" />)
    textarea = screen.getByPlaceholderText('Success state')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('border-green-500')
  })

  it('renders correctly with error state and message', () => {
    render(
      <Textarea
        isError
        errorMessage="This field is required"
        placeholder="Error textarea"
      />
    )

    const textarea = screen.getByPlaceholderText('Error textarea')
    const errorIcon = screen.getByTestId('alert-icon')
    const errorMessage = screen.getByText('This field is required')

    expect(textarea).toBeInTheDocument()
    expect(errorIcon).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
  })

  it.skip('renders correctly with helper text', () => {
    render(
      <Textarea
        helperText="This is a helper text"
        placeholder="Textarea with helper"
      />
    )

    const textarea = screen.getByPlaceholderText('Textarea with helper')
    const helperText = screen.getByText('This is a helper text')

    expect(textarea).toBeInTheDocument()
    expect(helperText).toBeInTheDocument()
    expect(textarea).toHaveAttribute('aria-describedby', expect.stringContaining('-helper'))
  })

  it('prioritizes error message over helper text', () => {
    render(
      <Textarea
        isError
        errorMessage="This field is required"
        helperText="This is a helper text"
        placeholder="Textarea with error"
      />
    )

    const textarea = screen.getByPlaceholderText('Textarea with error')
    const errorMessage = screen.getByText('This field is required')

    expect(textarea).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
    expect(screen.queryByText('This is a helper text')).not.toBeInTheDocument()
  })

  it('handles user input correctly', () => {
    render(<Textarea placeholder="Type here" />)

    const textarea = screen.getByPlaceholderText('Type here')
    fireEvent.change(textarea, { target: { value: 'Hello, world!' } })

    expect(textarea).toHaveValue('Hello, world!')
  })

  it('calls onChange handler when textarea changes', () => {
    const handleChange = jest.fn()
    render(<Textarea placeholder="Type here" onChange={handleChange} />)

    const textarea = screen.getByPlaceholderText('Type here')
    fireEvent.change(textarea, { target: { value: 'Hello, world!' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it.skip('does not allow input when disabled', () => {
    render(<Textarea placeholder="Disabled textarea" disabled />)

    const textarea = screen.getByPlaceholderText('Disabled textarea')
    expect(textarea).toBeDisabled()

    fireEvent.change(textarea, { target: { value: 'Hello, world!' } })
    expect(textarea).not.toHaveValue('Hello, world!')
  })

  it('renders correctly with custom className', () => {
    render(<Textarea className="custom-textarea" placeholder="Custom textarea" />)

    const textarea = screen.getByPlaceholderText('Custom textarea')
    expect(textarea).toHaveClass('custom-textarea')
  })

  it('renders correctly with rows attribute', () => {
    render(<Textarea rows={10} placeholder="Textarea with rows" />)

    const textarea = screen.getByPlaceholderText('Textarea with rows')
    expect(textarea).toHaveAttribute('rows', '10')
  })

  it('renders correctly with maxLength attribute', () => {
    render(<Textarea maxLength={100} placeholder="Textarea with maxLength" />)

    const textarea = screen.getByPlaceholderText('Textarea with maxLength')
    expect(textarea).toHaveAttribute('maxLength', '100')
  })

  it('renders correctly with required attribute', () => {
    render(<Textarea required placeholder="Required textarea" />)

    const textarea = screen.getByPlaceholderText('Required textarea')
    expect(textarea).toBeRequired()
  })

  it('renders correctly with readOnly attribute', () => {
    render(<Textarea readOnly placeholder="ReadOnly textarea" />)

    const textarea = screen.getByPlaceholderText('ReadOnly textarea')
    expect(textarea).toHaveAttribute('readOnly')
  })

  it('renders correctly with autoFocus attribute', () => {
    render(<Textarea autoFocus placeholder="AutoFocus textarea" />)

    const textarea = screen.getByPlaceholderText('AutoFocus textarea')
    expect(textarea).toHaveFocus()
  })

  it('passes additional props to the textarea', () => {
    render(
      <Textarea
        data-testid="custom-textarea"
        data-custom="value"
        placeholder="Textarea with custom props"
      />
    )

    const textarea = screen.getByTestId('custom-textarea')
    expect(textarea).toHaveAttribute('data-custom', 'value')
  })
})
