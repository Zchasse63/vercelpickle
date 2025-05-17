import { render, screen, fireEvent } from '@/lib/test-utils'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

describe('Tabs Component', () => {
  it.skip('renders correctly with default props', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
        <TabsContent value="tab3">Tab 3 Content</TabsContent>
      </Tabs>
    )

    // Check that the tabs container is rendered
    const tabsContainer = screen.getByRole('tablist').parentElement
    expect(tabsContainer).toBeInTheDocument()

    // Check that the tabs list is rendered
    const tabsList = screen.getByRole('tablist')
    expect(tabsList).toBeInTheDocument()

    // Check that the tab triggers are rendered
    const tabTriggers = screen.getAllByRole('tab')
    expect(tabTriggers.length).toBe(3)
    expect(tabTriggers[0]).toHaveTextContent('Tab 1')
    expect(tabTriggers[1]).toHaveTextContent('Tab 2')
    expect(tabTriggers[2]).toHaveTextContent('Tab 3')

    // Check that the first tab is selected by default
    expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'false')
    expect(tabTriggers[2]).toHaveAttribute('aria-selected', 'false')

    // Check that the first tab content is visible
    const tabContent = screen.getByText('Tab 1 Content')
    expect(tabContent).toBeInTheDocument()
    expect(tabContent).toBeVisible()

    // Check that the other tab contents are not visible
    expect(screen.queryByText('Tab 2 Content')).not.toBeVisible()
    expect(screen.queryByText('Tab 3 Content')).not.toBeVisible()
  })

  it('renders correctly with custom className', () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs">
        <TabsList className="custom-tabs-list">
          <TabsTrigger value="tab1" className="custom-tabs-trigger">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-tabs-content">Tab 1 Content</TabsContent>
      </Tabs>
    )

    // Check that the tabs container has the custom class
    const tabsContainer = screen.getByRole('tablist').parentElement
    expect(tabsContainer).toHaveClass('custom-tabs')

    // Check that the tabs list has the custom class
    const tabsList = screen.getByRole('tablist')
    expect(tabsList).toHaveClass('custom-tabs-list')

    // Check that the tab trigger has the custom class
    const tabTrigger = screen.getByRole('tab')
    expect(tabTrigger).toHaveClass('custom-tabs-trigger')

    // Check that the tab content has the custom class
    const tabContent = screen.getByText('Tab 1 Content')
    expect(tabContent).toHaveClass('custom-tabs-content')
  })

  it.skip('handles tab changes correctly', () => {
    const handleValueChange = jest.fn()

    render(
      <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    )

    // Check that the first tab is selected by default
    const tabTriggers = screen.getAllByRole('tab')
    expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'false')

    // Click on the second tab
    fireEvent.click(tabTriggers[1])

    // Check that the onValueChange handler was called with the correct value
    expect(handleValueChange).toHaveBeenCalledWith('tab2')

    // Check that the second tab is now selected
    expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'false')
    expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'true')

    // Check that the second tab content is now visible
    expect(screen.getByText('Tab 2 Content')).toBeVisible()

    // Check that the first tab content is not visible
    expect(screen.queryByText('Tab 1 Content')).not.toBeVisible()
  })

  it.skip('renders correctly with controlled value', () => {
    const { rerender } = render(
      <Tabs value="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    )

    // Check that the first tab is selected
    let tabTriggers = screen.getAllByRole('tab')
    expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'false')

    // Check that the first tab content is visible
    expect(screen.getByText('Tab 1 Content')).toBeVisible()
    expect(screen.queryByText('Tab 2 Content')).not.toBeVisible()

    // Update the value prop
    rerender(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    )

    // Check that the second tab is now selected
    tabTriggers = screen.getAllByRole('tab')
    expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'false')
    expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'true')

    // Check that the second tab content is now visible
    expect(screen.queryByText('Tab 1 Content')).not.toBeVisible()
    expect(screen.getByText('Tab 2 Content')).toBeVisible()
  })

  it.skip('renders correctly with disabled tabs', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2 (Disabled)</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
        <TabsContent value="tab3">Tab 3 Content</TabsContent>
      </Tabs>
    )

    // Check that the second tab is disabled
    const tabTriggers = screen.getAllByRole('tab')
    expect(tabTriggers[1]).toBeDisabled()

    // Try to click on the disabled tab
    fireEvent.click(tabTriggers[1])

    // Check that the first tab is still selected
    expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'false')

    // Check that the first tab content is still visible
    expect(screen.getByText('Tab 1 Content')).toBeVisible()
    expect(screen.queryByText('Tab 2 Content')).not.toBeVisible()
  })

  it.skip('renders correctly with different orientations', () => {
    // Test horizontal orientation (default)
    const { rerender } = render(
      <Tabs defaultValue="tab1" orientation="horizontal">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    )

    // Check that the tabs list has the horizontal class
    let tabsList = screen.getByRole('tablist')
    expect(tabsList).toHaveAttribute('aria-orientation', 'horizontal')
    expect(tabsList).toHaveClass('flex-row')

    // Test vertical orientation
    rerender(
      <Tabs defaultValue="tab1" orientation="vertical">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    )

    // Check that the tabs list has the vertical class
    tabsList = screen.getByRole('tablist')
    expect(tabsList).toHaveAttribute('aria-orientation', 'vertical')
    expect(tabsList).toHaveClass('flex-col')
  })

  it('passes additional props to tabs components', () => {
    render(
      <Tabs defaultValue="tab1" data-testid="tabs-test">
        <TabsList data-testid="tabs-list-test">
          <TabsTrigger value="tab1" data-testid="tabs-trigger-test">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" data-testid="tabs-content-test">Tab 1 Content</TabsContent>
      </Tabs>
    )

    // Check that the additional props are passed to the components
    expect(screen.getByTestId('tabs-test')).toBeInTheDocument()
    expect(screen.getByTestId('tabs-list-test')).toBeInTheDocument()
    expect(screen.getByTestId('tabs-trigger-test')).toBeInTheDocument()
    expect(screen.getByTestId('tabs-content-test')).toBeInTheDocument()
  })

  it.skip('handles keyboard navigation correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
        <TabsContent value="tab3">Tab 3 Content</TabsContent>
      </Tabs>
    )

    // Get the tab triggers
    const tabTriggers = screen.getAllByRole('tab')

    // Focus on the first tab
    tabTriggers[0].focus()

    // Press the right arrow key to navigate to the next tab
    fireEvent.keyDown(tabTriggers[0], { key: 'ArrowRight' })

    // Check that the second tab is focused
    expect(document.activeElement).toBe(tabTriggers[1])

    // Press the right arrow key again to navigate to the third tab
    fireEvent.keyDown(tabTriggers[1], { key: 'ArrowRight' })

    // Check that the third tab is focused
    expect(document.activeElement).toBe(tabTriggers[2])

    // Press the left arrow key to navigate back to the second tab
    fireEvent.keyDown(tabTriggers[2], { key: 'ArrowLeft' })

    // Check that the second tab is focused
    expect(document.activeElement).toBe(tabTriggers[1])
  })
})
