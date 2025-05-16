import { render, screen } from '@/lib/test-utils'
import { Flex, FlexItem } from '@/components/ui/flex'

describe('Flex Component', () => {
  it('renders correctly with default props', () => {
    render(
      <Flex>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Flex>
    )

    // Check that the flex container is rendered
    const flex = screen.getByText('Item 1').parentElement
    expect(flex).toBeInTheDocument()

    // Check that the flex container has the correct classes
    expect(flex).toHaveClass('flex')

    // Check that all items are rendered
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('renders correctly with custom className', () => {
    render(
      <Flex className="custom-flex">
        <div>Item 1</div>
      </Flex>
    )

    // Check that the flex container has the custom class
    const flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('custom-flex')
  })

  it('renders correctly with different directions', () => {
    // Test row direction (default)
    const { rerender } = render(
      <Flex direction="row">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    let flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('flex-row')

    // Test column direction
    rerender(
      <Flex direction="column">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('flex-col')

    // Test row-reverse direction
    rerender(
      <Flex direction="row-reverse">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('flex-row-reverse')

    // Test column-reverse direction
    rerender(
      <Flex direction="column-reverse">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('flex-col-reverse')
  })

  it('renders correctly with responsive direction', () => {
    render(
      <Flex direction={{ base: 'column', md: 'row' }}>
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    // Check that the flex container has the responsive direction classes
    const flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('flex-col')
    expect(flex).toHaveClass('md:flex-row')
  })

  it('renders correctly with different alignments', () => {
    // Test start alignment
    const { rerender } = render(
      <Flex align="start">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    let flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('items-start')

    // Test center alignment
    rerender(
      <Flex align="center">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('items-center')

    // Test end alignment
    rerender(
      <Flex align="end">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('items-end')

    // Test stretch alignment
    rerender(
      <Flex align="stretch">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('items-stretch')

    // Test baseline alignment
    rerender(
      <Flex align="baseline">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('items-baseline')
  })

  it('renders correctly with different justifications', () => {
    // Test start justification
    const { rerender } = render(
      <Flex justify="start">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    let flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('justify-start')

    // Test center justification
    rerender(
      <Flex justify="center">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('justify-center')

    // Test end justification
    rerender(
      <Flex justify="end">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('justify-end')

    // Test between justification
    rerender(
      <Flex justify="between">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('justify-between')

    // Test around justification
    rerender(
      <Flex justify="around">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('justify-around')

    // Test evenly justification
    rerender(
      <Flex justify="evenly">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('justify-evenly')
  })

  it('renders correctly with different gaps', () => {
    // Test small gap
    const { rerender } = render(
      <Flex gap="sm">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    let flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('gap-2')

    // Test medium gap
    rerender(
      <Flex gap="md">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('gap-4')

    // Test large gap
    rerender(
      <Flex gap="lg">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('gap-6')

    // Test extra large gap
    rerender(
      <Flex gap="xl">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('gap-8')

    // Test custom gap
    rerender(
      <Flex gap="10">
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('gap-10')
  })

  it('renders correctly with wrap', () => {
    render(
      <Flex wrap>
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    // Check that the flex container has the wrap class
    const flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('flex-wrap')
  })

  it('renders correctly with nowrap', () => {
    render(
      <Flex wrap={false}>
        <div>Item 1</div>
        <div>Item 2</div>
      </Flex>
    )

    // Check that the flex container has the nowrap class
    const flex = screen.getByText('Item 1').parentElement
    expect(flex).toHaveClass('flex-nowrap')
  })

  it('passes additional props to the flex container', () => {
    render(
      <Flex data-testid="flex-test" aria-label="Flex Container">
        <div>Item 1</div>
      </Flex>
    )

    // Check that the additional props are passed to the flex container
    const flex = screen.getByTestId('flex-test')
    expect(flex).toBeInTheDocument()
    expect(flex).toHaveAttribute('aria-label', 'Flex Container')
  })
})

describe('FlexItem Component', () => {
  it('renders correctly with default props', () => {
    render(
      <Flex>
        <FlexItem>Item 1</FlexItem>
      </Flex>
    )

    // Check that the flex item is rendered
    const flexItem = screen.getByText('Item 1').parentElement
    expect(flexItem).toBeInTheDocument()
  })

  it('renders correctly with custom className', () => {
    render(
      <Flex>
        <FlexItem className="custom-flex-item" data-testid="flex-item">Item 1</FlexItem>
      </Flex>
    )

    // Check that the flex item has the custom class
    // Note: The original test was looking for the class on the parent element of the text,
    // but our implementation applies the class to the FlexItem div itself.
    // We've modified the test to use data-testid to find the element.
    const flexItem = screen.getByTestId('flex-item')
    expect(flexItem).toHaveClass('custom-flex-item')
  })

  it('renders correctly with flex grow', () => {
    render(
      <Flex>
        <FlexItem grow data-testid="flex-item">Item 1</FlexItem>
      </Flex>
    )

    // Check that the flex item has the grow class
    const flexItem = screen.getByTestId('flex-item')
    expect(flexItem).toHaveClass('flex-grow')
  })

  it('renders correctly with flex shrink', () => {
    render(
      <Flex>
        <FlexItem shrink data-testid="flex-item">Item 1</FlexItem>
      </Flex>
    )

    // Check that the flex item has the shrink class
    const flexItem = screen.getByTestId('flex-item')
    expect(flexItem).toHaveClass('flex-shrink')
  })

  it('renders correctly with flex basis', () => {
    render(
      <Flex>
        <FlexItem basis="1/2" data-testid="flex-item">Item 1</FlexItem>
      </Flex>
    )

    // Check that the flex item has the basis class
    const flexItem = screen.getByTestId('flex-item')
    expect(flexItem).toHaveClass('basis-1/2')
  })

  it('renders correctly with self alignment', () => {
    // Test start self alignment
    const { rerender } = render(
      <Flex>
        <FlexItem self="start" data-testid="flex-item">Item 1</FlexItem>
      </Flex>
    )

    let flexItem = screen.getByTestId('flex-item')
    expect(flexItem).toHaveClass('self-start')

    // Test center self alignment
    rerender(
      <Flex>
        <FlexItem self="center" data-testid="flex-item">Item 1</FlexItem>
      </Flex>
    )

    flexItem = screen.getByTestId('flex-item')
    expect(flexItem).toHaveClass('self-center')

    // Test end self alignment
    rerender(
      <Flex>
        <FlexItem self="end" data-testid="flex-item">Item 1</FlexItem>
      </Flex>
    )

    flexItem = screen.getByTestId('flex-item')
    expect(flexItem).toHaveClass('self-end')

    // Test stretch self alignment
    rerender(
      <Flex>
        <FlexItem self="stretch" data-testid="flex-item">Item 1</FlexItem>
      </Flex>
    )

    flexItem = screen.getByTestId('flex-item')
    expect(flexItem).toHaveClass('self-stretch')

    // Test auto self alignment
    rerender(
      <Flex>
        <FlexItem self="auto" data-testid="flex-item">Item 1</FlexItem>
      </Flex>
    )

    flexItem = screen.getByTestId('flex-item')
    expect(flexItem).toHaveClass('self-auto')
  })

  it('passes additional props to the flex item', () => {
    render(
      <Flex>
        <FlexItem data-testid="flex-item-test" aria-label="Flex Item">
          Item 1
        </FlexItem>
      </Flex>
    )

    // Check that the additional props are passed to the flex item
    const flexItem = screen.getByTestId('flex-item-test')
    expect(flexItem).toBeInTheDocument()
    expect(flexItem).toHaveAttribute('aria-label', 'Flex Item')
  })
})
