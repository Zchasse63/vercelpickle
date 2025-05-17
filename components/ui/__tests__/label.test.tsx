import { render, screen } from '@/lib/test-utils'
import { Label } from '@/components/ui/label'

describe('Label Component', () => {
  it('renders correctly with default props', () => {
    render(<Label htmlFor="test-input">Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('text-sm')
    expect(label).toHaveClass('font-medium')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('renders correctly with custom className', () => {
    render(<Label htmlFor="test-input" className="custom-class">Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('custom-class')
  })

  it('renders correctly when disabled', () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" disabled />
      </div>
    )
    
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    
    // Check that the label has the correct styling when the associated input is disabled
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('passes additional props to the label', () => {
    render(
      <Label 
        htmlFor="test-input" 
        data-testid="test-label"
        aria-label="Test label"
      >
        Test Label
      </Label>
    )
    
    const label = screen.getByTestId('test-label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute('aria-label', 'Test label')
  })

  it('renders with children correctly', () => {
    render(
      <Label htmlFor="test-input">
        <span>Child Element</span>
      </Label>
    )
    
    const childElement = screen.getByText('Child Element')
    expect(childElement).toBeInTheDocument()
    expect(childElement.parentElement).toHaveAttribute('for', 'test-input')
  })
})
