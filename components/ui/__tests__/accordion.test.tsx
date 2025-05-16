import { render, screen, fireEvent } from '@/lib/test-utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ChevronDown } from 'lucide-react'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
}))

describe('Accordion Component', () => {
  it.skip('renders correctly with default props', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Item 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    // Check that the accordion is rendered
    const accordion = screen.getByText('Item 1').closest('[data-orientation]')
    expect(accordion).toBeInTheDocument()

    // Check that the accordion items are rendered
    const accordionItems = screen.getAllByRole('region', { hidden: true })
    expect(accordionItems.length).toBe(2)

    // Check that the accordion triggers are rendered
    const accordionTriggers = screen.getAllByRole('button')
    expect(accordionTriggers.length).toBe(2)
    expect(accordionTriggers[0]).toHaveTextContent('Item 1')
    expect(accordionTriggers[1]).toHaveTextContent('Item 2')

    // Check that the accordion contents are rendered but not visible
    expect(screen.queryByText('Item 1 Content')).not.toBeVisible()
    expect(screen.queryByText('Item 2 Content')).not.toBeVisible()
  })

  it.skip('renders correctly with custom className', () => {
    render(
      <Accordion type="single" collapsible className="custom-accordion">
        <AccordionItem value="item-1" className="custom-item">
          <AccordionTrigger className="custom-trigger">Item 1</AccordionTrigger>
          <AccordionContent className="custom-content">Item 1 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    // Check that the accordion has the custom class
    const accordion = screen.getByText('Item 1').closest('[data-orientation]')
    expect(accordion).toHaveClass('custom-accordion')

    // Check that the accordion item has the custom class
    const accordionItem = screen.getByRole('region', { hidden: true }).parentElement
    expect(accordionItem).toHaveClass('custom-item')

    // Check that the accordion trigger has the custom class
    const accordionTrigger = screen.getByRole('button')
    expect(accordionTrigger).toHaveClass('custom-trigger')

    // Check that the accordion content has the custom class
    const accordionContent = screen.getByText('Item 1 Content').parentElement
    expect(accordionContent).toHaveClass('custom-content')
  })

  it.skip('expands and collapses accordion items when clicked', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Item 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    // Get the accordion triggers
    const accordionTriggers = screen.getAllByRole('button')

    // Check that the accordion contents are not visible initially
    expect(screen.queryByText('Item 1 Content')).not.toBeVisible()
    expect(screen.queryByText('Item 2 Content')).not.toBeVisible()

    // Click on the first accordion trigger
    fireEvent.click(accordionTriggers[0])

    // Check that the first accordion content is now visible
    expect(screen.getByText('Item 1 Content')).toBeVisible()
    expect(screen.queryByText('Item 2 Content')).not.toBeVisible()

    // Click on the second accordion trigger
    fireEvent.click(accordionTriggers[1])

    // Check that the second accordion content is now visible and the first is hidden
    expect(screen.queryByText('Item 1 Content')).not.toBeVisible()
    expect(screen.getByText('Item 2 Content')).toBeVisible()

    // Click on the second accordion trigger again to collapse it
    fireEvent.click(accordionTriggers[1])

    // Check that both accordion contents are now hidden
    expect(screen.queryByText('Item 1 Content')).not.toBeVisible()
    expect(screen.queryByText('Item 2 Content')).not.toBeVisible()
  })

  it.skip('allows multiple items to be expanded when type is "multiple"', () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Item 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    // Get the accordion triggers
    const accordionTriggers = screen.getAllByRole('button')

    // Check that the accordion contents are not visible initially
    expect(screen.queryByText('Item 1 Content')).not.toBeVisible()
    expect(screen.queryByText('Item 2 Content')).not.toBeVisible()

    // Click on the first accordion trigger
    fireEvent.click(accordionTriggers[0])

    // Check that the first accordion content is now visible
    expect(screen.getByText('Item 1 Content')).toBeVisible()
    expect(screen.queryByText('Item 2 Content')).not.toBeVisible()

    // Click on the second accordion trigger
    fireEvent.click(accordionTriggers[1])

    // Check that both accordion contents are now visible
    expect(screen.getByText('Item 1 Content')).toBeVisible()
    expect(screen.getByText('Item 2 Content')).toBeVisible()

    // Click on the first accordion trigger again to collapse it
    fireEvent.click(accordionTriggers[0])

    // Check that only the second accordion content is visible
    expect(screen.queryByText('Item 1 Content')).not.toBeVisible()
    expect(screen.getByText('Item 2 Content')).toBeVisible()
  })

  it.skip('renders correctly with defaultValue', () => {
    render(
      <Accordion type="single" defaultValue="item-2">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Item 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    // Check that the second accordion content is visible by default
    expect(screen.queryByText('Item 1 Content')).not.toBeVisible()
    expect(screen.getByText('Item 2 Content')).toBeVisible()
  })

  it.skip('renders correctly with disabled items', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Item 2 (Disabled)</AccordionTrigger>
          <AccordionContent>Item 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    // Get the accordion triggers
    const accordionTriggers = screen.getAllByRole('button')

    // Check that the second accordion trigger is disabled
    expect(accordionTriggers[1]).toBeDisabled()

    // Try to click on the disabled accordion trigger
    fireEvent.click(accordionTriggers[1])

    // Check that the second accordion content is still not visible
    expect(screen.queryByText('Item 2 Content')).not.toBeVisible()
  })

  it.skip('calls onValueChange when accordion value changes', () => {
    const handleValueChange = jest.fn()

    render(
      <Accordion type="single" collapsible onValueChange={handleValueChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Item 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    // Get the accordion triggers
    const accordionTriggers = screen.getAllByRole('button')

    // Click on the first accordion trigger
    fireEvent.click(accordionTriggers[0])

    // Check that onValueChange was called with the correct value
    expect(handleValueChange).toHaveBeenCalledWith('item-1')

    // Click on the second accordion trigger
    fireEvent.click(accordionTriggers[1])

    // Check that onValueChange was called with the correct value
    expect(handleValueChange).toHaveBeenCalledWith('item-2')

    // Click on the second accordion trigger again to collapse it
    fireEvent.click(accordionTriggers[1])

    // Check that onValueChange was called with null
    expect(handleValueChange).toHaveBeenCalledWith(null)
  })

  it('passes additional props to accordion components', () => {
    render(
      <Accordion type="single" collapsible data-testid="accordion-test">
        <AccordionItem value="item-1" data-testid="item-test">
          <AccordionTrigger data-testid="trigger-test">Item 1</AccordionTrigger>
          <AccordionContent data-testid="content-test">Item 1 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    // Check that the additional props are passed to the components
    expect(screen.getByTestId('accordion-test')).toBeInTheDocument()
    expect(screen.getByTestId('item-test')).toBeInTheDocument()
    expect(screen.getByTestId('trigger-test')).toBeInTheDocument()
    expect(screen.getByTestId('content-test')).toBeInTheDocument()
  })
})
