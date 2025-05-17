import { render, screen } from '@/lib/test-utils'
import { Container } from '@/components/ui/container'

describe('Container Component', () => {
  it('renders correctly with default props', () => {
    render(
      <Container>
        <p>Container content</p>
      </Container>
    )
    
    // Check that the container is rendered
    const container = screen.getByText('Container content').parentElement
    expect(container).toBeInTheDocument()
    
    // Check that the container has the correct classes
    expect(container).toHaveClass('container')
    expect(container).toHaveClass('mx-auto')
    expect(container).toHaveClass('px-4')
    expect(container).toHaveClass('md:px-6')
  })

  it('renders correctly with custom className', () => {
    render(
      <Container className="custom-container">
        <p>Container content</p>
      </Container>
    )
    
    // Check that the container has the custom class
    const container = screen.getByText('Container content').parentElement
    expect(container).toHaveClass('custom-container')
    
    // Check that the container still has the default classes
    expect(container).toHaveClass('container')
    expect(container).toHaveClass('mx-auto')
  })

  it('renders children correctly', () => {
    render(
      <Container>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </Container>
    )
    
    // Check that all children are rendered
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })

  it('passes additional props to the container', () => {
    render(
      <Container data-testid="container-test" aria-label="Container">
        <p>Container content</p>
      </Container>
    )
    
    // Check that the additional props are passed
    const container = screen.getByTestId('container-test')
    expect(container).toBeInTheDocument()
    expect(container).toHaveAttribute('aria-label', 'Container')
  })

  it('renders nested containers correctly', () => {
    render(
      <Container data-testid="outer-container">
        <p>Outer container content</p>
        <Container data-testid="inner-container">
          <p>Inner container content</p>
        </Container>
      </Container>
    )
    
    // Check that both containers are rendered
    const outerContainer = screen.getByTestId('outer-container')
    const innerContainer = screen.getByTestId('inner-container')
    
    expect(outerContainer).toBeInTheDocument()
    expect(innerContainer).toBeInTheDocument()
    
    // Check that the content is rendered in the correct containers
    expect(outerContainer).toHaveTextContent('Outer container content')
    expect(innerContainer).toHaveTextContent('Inner container content')
  })
})
