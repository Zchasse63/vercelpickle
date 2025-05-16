import { render, screen, fireEvent } from '@/lib/test-utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

describe('Popover Component', () => {
  it('renders correctly with default props', () => {
    render(
      <Popover>
        <PopoverTrigger data-testid="popover-trigger">Open Popover</PopoverTrigger>
        <PopoverContent data-testid="popover-content">Popover Content</PopoverContent>
      </Popover>
    )
    
    // Check that the popover trigger is rendered
    const popoverTrigger = screen.getByTestId('popover-trigger')
    expect(popoverTrigger).toBeInTheDocument()
    expect(popoverTrigger).toHaveTextContent('Open Popover')
    
    // Check that the popover content is not visible initially
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument()
  })

  it('renders correctly with custom className', () => {
    render(
      <Popover>
        <PopoverTrigger className="custom-trigger" data-testid="popover-trigger">Open Popover</PopoverTrigger>
        <PopoverContent className="custom-content" data-testid="popover-content">Popover Content</PopoverContent>
      </Popover>
    )
    
    // Check that the popover trigger has the custom class
    const popoverTrigger = screen.getByTestId('popover-trigger')
    expect(popoverTrigger).toHaveClass('custom-trigger')
  })

  it('passes additional props to popover components', () => {
    render(
      <Popover data-testid="popover-root">
        <PopoverTrigger data-testid="popover-trigger" aria-label="Open popover">Open Popover</PopoverTrigger>
        <PopoverContent data-testid="popover-content" aria-label="Popover content">Popover Content</PopoverContent>
      </Popover>
    )
    
    // Check that the additional props are passed to the components
    const popoverTrigger = screen.getByTestId('popover-trigger')
    expect(popoverTrigger).toHaveAttribute('aria-label', 'Open popover')
  })
})
