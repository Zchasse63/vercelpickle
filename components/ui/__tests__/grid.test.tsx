import { render, screen } from '@/lib/test-utils'
import { Grid, GridItem } from '@/components/ui/grid'

describe('Grid Component', () => {
  it('renders correctly with default props', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Grid>
    )

    // Check that the grid is rendered
    const grid = screen.getByText('Item 1').parentElement
    expect(grid).toBeInTheDocument()

    // Check that the grid has the correct classes
    expect(grid).toHaveClass('grid')

    // Check that all items are rendered
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('renders correctly with custom className', () => {
    render(
      <Grid className="custom-grid">
        <div>Item 1</div>
      </Grid>
    )

    // Check that the grid has the custom class
    const grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('custom-grid')
  })

  it('renders correctly with different column counts', () => {
    // Test 2 columns
    const { rerender } = render(
      <Grid cols={2}>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    let grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('grid-cols-2')

    // Test 3 columns
    rerender(
      <Grid cols={3}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Grid>
    )

    grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('grid-cols-3')

    // Test 4 columns
    rerender(
      <Grid cols={4}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </Grid>
    )

    grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('grid-cols-4')
  })

  it('renders correctly with responsive column counts', () => {
    render(
      <Grid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
        <div>Item 5</div>
      </Grid>
    )

    // Check that the grid has the responsive column classes
    const grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('sm:grid-cols-2')
    expect(grid).toHaveClass('md:grid-cols-3')
    expect(grid).toHaveClass('lg:grid-cols-4')
    expect(grid).toHaveClass('xl:grid-cols-5')
  })

  it('renders correctly with different gap sizes', () => {
    // Test small gap
    const { rerender } = render(
      <Grid gap="sm">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    let grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('gap-2')

    // Test medium gap
    rerender(
      <Grid gap="md">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('gap-4')

    // Test large gap
    rerender(
      <Grid gap="lg">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('gap-6')

    // Test extra large gap
    rerender(
      <Grid gap="xl">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('gap-8')

    // Test custom gap
    rerender(
      <Grid gap="10">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('gap-10')
  })

  it('renders correctly with different row gap sizes', () => {
    render(
      <Grid rowGap="md">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    // Check that the grid has the row gap class
    const grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('gap-y-4')
  })

  it('renders correctly with different column gap sizes', () => {
    render(
      <Grid colGap="md">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    // Check that the grid has the column gap class
    const grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('gap-x-4')
  })

  it('renders correctly with auto rows', () => {
    render(
      <Grid autoRows="min-content">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    // Check that the grid has the auto rows class
    const grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('auto-rows-min')
  })

  it('renders correctly with auto columns', () => {
    render(
      <Grid autoColumns="min-content">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    // Check that the grid has the auto columns class
    const grid = screen.getByText('Item 1').parentElement
    expect(grid).toHaveClass('auto-cols-min')
  })

  it('passes additional props to the grid', () => {
    render(
      <Grid data-testid="grid-test" aria-label="Grid">
        <div>Item 1</div>
      </Grid>
    )

    // Check that the additional props are passed to the grid
    const grid = screen.getByTestId('grid-test')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveAttribute('aria-label', 'Grid')
  })
})

describe('GridItem Component', () => {
  it('renders correctly with default props', () => {
    render(
      <Grid>
        <GridItem>Item 1</GridItem>
      </Grid>
    )

    // Check that the grid item is rendered
    const gridItem = screen.getByText('Item 1').parentElement
    expect(gridItem).toBeInTheDocument()
  })

  it('renders correctly with custom className', () => {
    render(
      <Grid>
        <GridItem className="custom-grid-item" data-testid="grid-item">Item 1</GridItem>
      </Grid>
    )

    // Check that the grid item has the custom class
    const gridItem = screen.getByTestId('grid-item')
    expect(gridItem).toHaveClass('custom-grid-item')
  })

  it('renders correctly with column span', () => {
    render(
      <Grid>
        <GridItem colSpan={2} data-testid="grid-item">Item 1</GridItem>
      </Grid>
    )

    // Check that the grid item has the column span class
    const gridItem = screen.getByTestId('grid-item')
    expect(gridItem).toHaveClass('col-span-2')
  })

  it('renders correctly with responsive column span', () => {
    render(
      <Grid>
        <GridItem colSpan={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} data-testid="grid-item">Item 1</GridItem>
      </Grid>
    )

    // Check that the grid item has the responsive column span classes
    const gridItem = screen.getByTestId('grid-item')
    expect(gridItem).toHaveClass('col-span-1')
    expect(gridItem).toHaveClass('sm:col-span-2')
    expect(gridItem).toHaveClass('md:col-span-3')
    expect(gridItem).toHaveClass('lg:col-span-4')
    expect(gridItem).toHaveClass('xl:col-span-5')
  })

  it('renders correctly with row span', () => {
    render(
      <Grid>
        <GridItem rowSpan={2} data-testid="grid-item">Item 1</GridItem>
      </Grid>
    )

    // Check that the grid item has the row span class
    const gridItem = screen.getByTestId('grid-item')
    expect(gridItem).toHaveClass('row-span-2')
  })

  it('renders correctly with responsive row span', () => {
    render(
      <Grid>
        <GridItem rowSpan={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} data-testid="grid-item">Item 1</GridItem>
      </Grid>
    )

    // Check that the grid item has the responsive row span classes
    const gridItem = screen.getByTestId('grid-item')
    expect(gridItem).toHaveClass('row-span-1')
    expect(gridItem).toHaveClass('sm:row-span-2')
    expect(gridItem).toHaveClass('md:row-span-3')
    expect(gridItem).toHaveClass('lg:row-span-4')
    expect(gridItem).toHaveClass('xl:row-span-5')
  })

  it('renders correctly with column start', () => {
    render(
      <Grid>
        <GridItem colStart={2} data-testid="grid-item">Item 1</GridItem>
      </Grid>
    )

    // Check that the grid item has the column start class
    const gridItem = screen.getByTestId('grid-item')
    expect(gridItem).toHaveClass('col-start-2')
  })

  it('renders correctly with row start', () => {
    render(
      <Grid>
        <GridItem rowStart={2} data-testid="grid-item">Item 1</GridItem>
      </Grid>
    )

    // Check that the grid item has the row start class
    const gridItem = screen.getByTestId('grid-item')
    expect(gridItem).toHaveClass('row-start-2')
  })

  it('passes additional props to the grid item', () => {
    render(
      <Grid>
        <GridItem data-testid="grid-item-test" aria-label="Grid Item">
          Item 1
        </GridItem>
      </Grid>
    )

    // Check that the additional props are passed to the grid item
    const gridItem = screen.getByTestId('grid-item-test')
    expect(gridItem).toBeInTheDocument()
    expect(gridItem).toHaveAttribute('aria-label', 'Grid Item')
  })
})
