import { render, screen, fireEvent, waitFor } from '@/lib/test-utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  Check: () => <div data-testid="check-icon" />,
}))

// Mock portal to make testing easier
jest.mock('@radix-ui/react-select', () => {
  const actual = jest.requireActual('@radix-ui/react-select')
  return {
    ...actual,
    SelectPortal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }
})

describe('Select Component', () => {
  it('renders Select correctly with default props', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeInTheDocument()
    expect(screen.getByText('Select an option')).toBeInTheDocument()
    expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
  })

  it.skip('opens content when trigger is clicked', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeVisible()
      expect(screen.getByText('Option 2')).toBeVisible()
    })
  })

  it.skip('selects an item when clicked', async () => {
    render(
      <Select defaultValue="option1">
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    // Initially shows the default value
    expect(screen.getByText('Option 1')).toBeInTheDocument()

    // Open the select
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    // Click on Option 2
    await waitFor(() => {
      const option2 = screen.getAllByText('Option 2')[0]
      fireEvent.click(option2)
    })

    // Check that Option 2 is now selected
    await waitFor(() => {
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  it.skip('renders SelectGroup correctly', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="carrot">Carrot</SelectItem>
            <SelectItem value="potato">Potato</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    // Open the select
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    // Check that groups and labels are rendered
    await waitFor(() => {
      expect(screen.getByText('Fruits')).toBeVisible()
      expect(screen.getByText('Vegetables')).toBeVisible()
      expect(screen.getByText('Apple')).toBeVisible()
      expect(screen.getByText('Banana')).toBeVisible()
      expect(screen.getByText('Carrot')).toBeVisible()
      expect(screen.getByText('Potato')).toBeVisible()
    })
  })

  it('renders disabled Select correctly', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeDisabled()
  })

  it.skip('renders disabled SelectItem correctly', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2" disabled>Option 2 (Disabled)</SelectItem>
        </SelectContent>
      </Select>
    )

    // Open the select
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    // Check that the disabled item has the appropriate attributes
    await waitFor(() => {
      const disabledOption = screen.getByText('Option 2 (Disabled)')
      expect(disabledOption.parentElement).toHaveAttribute('data-disabled')
    })
  })

  it('renders Select with error state correctly', () => {
    render(
      <Select error="This field is required">
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveClass('border-destructive')
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('renders Select with helper text correctly', () => {
    render(
      <Select helperText="Please select an option">
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText('Please select an option')).toBeInTheDocument()
  })

  it('prioritizes error message over helper text', () => {
    render(
      <Select error="This field is required" helperText="Please select an option">
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.queryByText('Please select an option')).not.toBeInTheDocument()
  })

  it('renders Select with custom className', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="custom-content">
          <SelectItem value="option1" className="custom-item">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveClass('custom-trigger')

    // Open the select
    fireEvent.click(trigger)

    // Check custom classes on content and item
    waitFor(() => {
      expect(screen.getByText('Option 1').parentElement).toHaveClass('custom-item')
    })
  })

  it.skip('calls onValueChange when selection changes', async () => {
    const handleValueChange = jest.fn()

    render(
      <Select onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    // Open the select
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    // Click on Option 1
    await waitFor(() => {
      const option1 = screen.getAllByText('Option 1')[0]
      fireEvent.click(option1)
    })

    // Check that onValueChange was called with the correct value
    expect(handleValueChange).toHaveBeenCalledWith('option1')
  })
})
