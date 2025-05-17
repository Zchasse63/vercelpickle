import { render, screen } from '@/lib/test-utils'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'

describe('Card Component', () => {
  it('renders Card correctly with default props', () => {
    render(<Card>Card Content</Card>)

    const card = screen.getByText('Card Content')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('rounded-lg')
    expect(card).toHaveClass('border')
    expect(card).toHaveClass('bg-card')
  })

  it('renders Card with custom className', () => {
    render(<Card className="custom-class">Card Content</Card>)

    const card = screen.getByText('Card Content')
    expect(card).toHaveClass('custom-class')
  })

  it('renders CardHeader correctly', () => {
    render(<CardHeader>Header Content</CardHeader>)

    const header = screen.getByText('Header Content')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex')
    expect(header).toHaveClass('flex-col')
    expect(header).toHaveClass('space-y-1.5')
    expect(header).toHaveClass('p-6')
  })

  it('renders CardHeader with custom className', () => {
    render(<CardHeader className="custom-header">Header Content</CardHeader>)

    const header = screen.getByText('Header Content')
    expect(header).toHaveClass('custom-header')
  })

  it('renders CardTitle correctly', () => {
    render(<CardTitle>Card Title</CardTitle>)

    const title = screen.getByText('Card Title')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-2xl')
    expect(title).toHaveClass('font-semibold')
  })

  it('renders CardTitle with custom className', () => {
    render(<CardTitle className="custom-title">Card Title</CardTitle>)

    const title = screen.getByText('Card Title')
    expect(title).toHaveClass('custom-title')
  })

  it('renders CardDescription correctly', () => {
    render(<CardDescription>Card Description</CardDescription>)

    const description = screen.getByText('Card Description')
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('text-sm')
    expect(description).toHaveClass('text-muted-foreground')
  })

  it('renders CardDescription with custom className', () => {
    render(<CardDescription className="custom-description">Card Description</CardDescription>)

    const description = screen.getByText('Card Description')
    expect(description).toHaveClass('custom-description')
  })

  it('renders CardContent correctly', () => {
    render(<CardContent>Content</CardContent>)

    const content = screen.getByText('Content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('p-6')
    expect(content).toHaveClass('pt-0')
  })

  it('renders CardContent with custom className', () => {
    render(<CardContent className="custom-content">Content</CardContent>)

    const content = screen.getByText('Content')
    expect(content).toHaveClass('custom-content')
  })

  it('renders CardFooter correctly', () => {
    render(<CardFooter>Footer Content</CardFooter>)

    const footer = screen.getByText('Footer Content')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('flex')
    expect(footer).toHaveClass('items-center')
    expect(footer).toHaveClass('p-6')
    expect(footer).toHaveClass('pt-0')
  })

  it('renders CardFooter with custom className', () => {
    render(<CardFooter className="custom-footer">Footer Content</CardFooter>)

    const footer = screen.getByText('Footer Content')
    expect(footer).toHaveClass('custom-footer')
  })

  it('renders a complete card with all subcomponents', () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card with all subcomponents</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card</p>
        </CardContent>
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      </Card>
    )

    const card = screen.getByTestId('complete-card')
    expect(card).toBeInTheDocument()

    const title = screen.getByText('Complete Card')
    expect(title).toBeInTheDocument()

    const description = screen.getByText('This is a complete card with all subcomponents')
    expect(description).toBeInTheDocument()

    const content = screen.getByText('This is the main content of the card')
    expect(content).toBeInTheDocument()

    const button = screen.getByRole('button', { name: 'Action Button' })
    expect(button).toBeInTheDocument()
  })

  it('passes additional props to Card component', () => {
    render(
      <Card data-testid="card-with-props" aria-label="Card with props">
        Card Content
      </Card>
    )

    const card = screen.getByTestId('card-with-props')
    expect(card).toHaveAttribute('aria-label', 'Card with props')
  })

  it('passes additional props to CardHeader component', () => {
    render(
      <CardHeader data-testid="header-with-props" aria-label="Header with props">
        Header Content
      </CardHeader>
    )

    const header = screen.getByTestId('header-with-props')
    expect(header).toHaveAttribute('aria-label', 'Header with props')
  })

  it('passes additional props to CardContent component', () => {
    render(
      <CardContent data-testid="content-with-props" aria-label="Content with props">
        Content
      </CardContent>
    )

    const content = screen.getByTestId('content-with-props')
    expect(content).toHaveAttribute('aria-label', 'Content with props')
  })

  it('passes additional props to CardFooter component', () => {
    render(
      <CardFooter data-testid="footer-with-props" aria-label="Footer with props">
        Footer Content
      </CardFooter>
    )

    const footer = screen.getByTestId('footer-with-props')
    expect(footer).toHaveAttribute('aria-label', 'Footer with props')
  })

  it('passes additional props to CardTitle component', () => {
    render(
      <CardTitle data-testid="title-with-props" aria-label="Title with props">
        Card Title
      </CardTitle>
    )

    const title = screen.getByTestId('title-with-props')
    expect(title).toHaveAttribute('aria-label', 'Title with props')
  })

  it('passes additional props to CardDescription component', () => {
    render(
      <CardDescription data-testid="description-with-props" aria-label="Description with props">
        Card Description
      </CardDescription>
    )

    const description = screen.getByTestId('description-with-props')
    expect(description).toHaveAttribute('aria-label', 'Description with props')
  })
})
