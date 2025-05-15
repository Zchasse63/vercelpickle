import { render, screen } from '@/lib/test-utils'
import { ProductCard } from '@/components/marketplace/product-card'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock useCart hook
jest.mock('@/hooks/use-cart', () => ({
  useCart: () => ({
    addItem: jest.fn(),
  }),
}))

// Mock useAuth hook
jest.mock('../../../providers/auth-provider', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
  }),
}))

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 'product-1',
    name: 'Test Product',
    description: 'This is a test product',
    price: 19.99,
    unit: 'kg',
    image: '/test-image.jpg',
    seller: 'Test Seller',
    sellerId: 'seller-1',
    rating: 4.5,
    reviews: 10,
    badges: [
      { label: 'Organic', color: 'bg-green-100 text-green-800' },
      { label: 'Local', color: 'bg-blue-100 text-blue-800' },
    ],
  }

  it('renders product information correctly', () => {
    render(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        image={mockProduct.image}
        category="Test Category"
        unit={mockProduct.unit}
        seller={{ id: mockProduct.sellerId, name: mockProduct.seller }}
      />
    )

    // Check if product name is rendered
    expect(screen.getByText('Test Product')).toBeInTheDocument()

    // Check if price is rendered
    expect(screen.getByText('$19.99')).toBeInTheDocument()
    expect(screen.getByText('kg', { exact: false })).toBeInTheDocument()

    // We don't display the full description in the card anymore
    // expect(screen.getByText('This is a test product')).toBeInTheDocument()

    // We don't display seller information in the card anymore
    // expect(screen.getByText(/Test Seller/i)).toBeInTheDocument()
  })

  it('renders badges correctly', () => {
    render(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        image={mockProduct.image}
        category="Test Category"
        unit={mockProduct.unit}
        seller={{ id: mockProduct.sellerId, name: mockProduct.seller }}
        specifications={{
          dietary: {
            organic: true
          },
          ecofriendly: true
        }}
      />
    )

    // Check if Organic badge is rendered
    expect(screen.getByText('Organic')).toBeInTheDocument()

    // Eco-Friendly badge is not shown when organic is present
    expect(screen.queryByText('Eco-Friendly')).not.toBeInTheDocument()
  })

  it('renders Add to Cart button', () => {
    render(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        image={mockProduct.image}
        category="Test Category"
        unit={mockProduct.unit}
        seller={{ id: mockProduct.sellerId, name: mockProduct.seller }}
      />
    )

    // Check if Add to Cart button is rendered
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
  })

  it('renders Compare button when onAddToComparison is provided', () => {
    const onAddToComparison = jest.fn()

    render(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        image={mockProduct.image}
        category="Test Category"
        unit={mockProduct.unit}
        seller={{ id: mockProduct.sellerId, name: mockProduct.seller }}
        onAddToComparison={onAddToComparison}
      />
    )

    // Check if Compare button is rendered
    expect(screen.getByRole('button', { name: /compare/i })).toBeInTheDocument()
  })

  it('does not render Compare button when onAddToComparison is not provided', () => {
    render(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        image={mockProduct.image}
        category="Test Category"
        unit={mockProduct.unit}
        seller={{ id: mockProduct.sellerId, name: mockProduct.seller }}
      />
    )

    // Check that Compare button is not rendered
    expect(screen.queryByRole('button', { name: /compare/i })).not.toBeInTheDocument()
  })
})
