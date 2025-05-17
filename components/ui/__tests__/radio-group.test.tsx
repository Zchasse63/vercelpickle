import { render, screen, fireEvent } from '@/lib/test-utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Circle } from 'lucide-react'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Circle: () => <div data-testid="circle-icon" />,
}))

describe('RadioGroup Component', () => {
  it('renders correctly with default props', () => {
    render(
      <RadioGroup defaultValue="option1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option3" id="option3" />
          <label htmlFor="option3">Option 3</label>
        </div>
      </RadioGroup>
    )

    // Check that the radio group is rendered
    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toBeInTheDocument()

    // Check that the radio items are rendered
    const radioItems = screen.getAllByRole('radio')
    expect(radioItems.length).toBe(3)

    // Check that the first option is selected by default
    expect(radioItems[0]).toBeChecked()
    expect(radioItems[1]).not.toBeChecked()
    expect(radioItems[2]).not.toBeChecked()

    // Check that the labels are rendered
    const labels = screen.getAllByText(/Option \d/)
    expect(labels.length).toBe(3)
    expect(labels[0]).toHaveTextContent('Option 1')
    expect(labels[1]).toHaveTextContent('Option 2')
    expect(labels[2]).toHaveTextContent('Option 3')
  })

  it.skip('handles value changes correctly', () => {
    const handleValueChange = jest.fn()

    render(
      <RadioGroup defaultValue="option1" onValueChange={handleValueChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>
    )

    // Check that the first option is selected by default
    const radioItems = screen.getAllByRole('radio')
    expect(radioItems[0]).toBeChecked()
    expect(radioItems[1]).not.toBeChecked()

    // Click on the second option
    fireEvent.click(radioItems[1])

    // Check that the second option is now selected
    expect(radioItems[0]).not.toBeChecked()
    expect(radioItems[1]).toBeChecked()

    // Check that the onValueChange handler was called with the correct value
    expect(handleValueChange).toHaveBeenCalledWith('option2')
  })

  it('renders correctly with custom className', () => {
    render(
      <RadioGroup className="custom-radio-group" defaultValue="option1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem className="custom-radio-item" value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
      </RadioGroup>
    )

    // Check that the radio group has the custom class
    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toHaveClass('custom-radio-group')

    // Check that the radio item has the custom class
    const radioItem = screen.getByRole('radio')
    expect(radioItem).toHaveClass('custom-radio-item')
  })

  it('renders correctly when disabled', () => {
    render(
      <RadioGroup defaultValue="option1" disabled>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>
    )

    // Check that all radio items are disabled
    const radioItems = screen.getAllByRole('radio')
    radioItems.forEach(item => {
      expect(item).toBeDisabled()
    })
  })

  it('renders correctly with individual disabled items', () => {
    render(
      <RadioGroup defaultValue="option1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" disabled />
          <label htmlFor="option2">Option 2 (Disabled)</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option3" id="option3" />
          <label htmlFor="option3">Option 3</label>
        </div>
      </RadioGroup>
    )

    // Check that only the second radio item is disabled
    const radioItems = screen.getAllByRole('radio')
    expect(radioItems[0]).not.toBeDisabled()
    expect(radioItems[1]).toBeDisabled()
    expect(radioItems[2]).not.toBeDisabled()
  })

  it.skip('renders correctly with required attribute', () => {
    render(
      <RadioGroup defaultValue="option1" required>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
      </RadioGroup>
    )

    // Check that the radio group has the required attribute
    const radioItems = screen.getAllByRole('radio')
    radioItems.forEach(item => {
      expect(item).toBeRequired()
    })
  })

  it('renders indicator when item is checked', () => {
    render(
      <RadioGroup defaultValue="option1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>
    )

    // Check that the indicator is rendered for the checked item
    const circleIcon = screen.getByTestId('circle-icon')
    expect(circleIcon).toBeInTheDocument()

    // Get all radio items
    const radioItems = screen.getAllByRole('radio')

    // Click on the second option
    fireEvent.click(radioItems[1])

    // Check that the indicator is still rendered (now for the second item)
    expect(screen.getByTestId('circle-icon')).toBeInTheDocument()
  })

  it('passes additional props to the radio group and items', () => {
    render(
      <RadioGroup
        defaultValue="option1"
        data-testid="radio-group-test"
        aria-label="Options"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="option1"
            id="option1"
            data-testid="radio-item-test"
            aria-label="First option"
          />
          <label htmlFor="option1">Option 1</label>
        </div>
      </RadioGroup>
    )

    // Check that the additional props are passed to the radio group
    const radioGroup = screen.getByTestId('radio-group-test')
    expect(radioGroup).toBeInTheDocument()
    expect(radioGroup).toHaveAttribute('aria-label', 'Options')

    // Check that the additional props are passed to the radio item
    const radioItem = screen.getByTestId('radio-item-test')
    expect(radioItem).toBeInTheDocument()
    expect(radioItem).toHaveAttribute('aria-label', 'First option')
  })
})
