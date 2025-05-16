import { render, screen, fireEvent } from '@/lib/test-utils'
import { Checkbox } from '@/components/ui/checkbox'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
}))

describe('Checkbox Component', () => {
  it('renders correctly with default props', () => {
    render(<Checkbox />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
    expect(checkbox).toHaveClass('border-primary')
    expect(checkbox).toHaveClass('h-4')
    expect(checkbox).toHaveClass('w-4')
  })

  it.skip('renders correctly when checked', () => {
    render(<Checkbox checked />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
    expect(checkbox).toHaveClass('bg-primary')
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
  })

  it.skip('renders correctly when disabled', () => {
    render(<Checkbox disabled />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveClass('opacity-50')
    expect(checkbox).toHaveClass('cursor-not-allowed')
  })

  it('renders correctly with label', () => {
    render(
      <div>
        <Checkbox id="terms" />
        <label htmlFor="terms">Accept terms and conditions</label>
      </div>
    )

    const checkbox = screen.getByRole('checkbox')
    const label = screen.getByText('Accept terms and conditions')

    expect(checkbox).toBeInTheDocument()
    expect(label).toBeInTheDocument()
    expect(checkbox).toHaveAttribute('id', 'terms')
    expect(label).toHaveAttribute('for', 'terms')
  })

  it('renders correctly with different sizes', () => {
    // Small size
    const { rerender } = render(<Checkbox size="sm" />)
    let checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('h-3')
    expect(checkbox).toHaveClass('w-3')

    // Medium size (default)
    rerender(<Checkbox size="md" />)
    checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('h-4')
    expect(checkbox).toHaveClass('w-4')

    // Large size
    rerender(<Checkbox size="lg" />)
    checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('h-5')
    expect(checkbox).toHaveClass('w-5')
  })

  it('renders correctly with custom className', () => {
    render(<Checkbox className="custom-checkbox" />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('custom-checkbox')
  })

  it.skip('handles click events correctly', () => {
    const handleCheckedChange = jest.fn()
    render(<Checkbox onCheckedChange={handleCheckedChange} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(handleCheckedChange).toHaveBeenCalledTimes(1)
    expect(handleCheckedChange).toHaveBeenCalledWith(true)
  })

  it.skip('does not trigger click events when disabled', () => {
    const handleCheckedChange = jest.fn()
    render(<Checkbox disabled onCheckedChange={handleCheckedChange} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(handleCheckedChange).not.toHaveBeenCalled()
  })

  it('toggles checked state when clicked', () => {
    render(<Checkbox />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it.skip('renders correctly with indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
    expect(checkbox).toHaveClass('bg-primary')
  })

  it('renders correctly with required attribute', () => {
    render(<Checkbox required />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeRequired()
  })

  it.skip('renders correctly with name attribute', () => {
    render(<Checkbox name="terms" />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('name', 'terms')
  })

  it('renders correctly with value attribute', () => {
    render(<Checkbox value="accepted" />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('value', 'accepted')
  })

  it('renders correctly with aria-label attribute', () => {
    render(<Checkbox aria-label="Accept terms" />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-label', 'Accept terms')
  })

  it('renders correctly with aria-labelledby attribute', () => {
    render(
      <div>
        <span id="terms-label">Accept terms and conditions</span>
        <Checkbox aria-labelledby="terms-label" />
      </div>
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-labelledby', 'terms-label')
  })

  it('renders correctly with aria-describedby attribute', () => {
    render(
      <div>
        <span id="terms-description">By accepting, you agree to our terms of service</span>
        <Checkbox aria-describedby="terms-description" />
      </div>
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-describedby', 'terms-description')
  })

  it('passes additional props to the checkbox', () => {
    render(<Checkbox data-testid="custom-checkbox" data-custom="value" />)

    const checkbox = screen.getByTestId('custom-checkbox')
    expect(checkbox).toHaveAttribute('data-custom', 'value')
  })
})
