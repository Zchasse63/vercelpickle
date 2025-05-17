import { render, screen } from '@/lib/test-utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage
} from '@/components/ui/skeleton-elements'

describe('Skeleton Component', () => {
  it('renders correctly with default props', () => {
    render(<Skeleton />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('relative')
    expect(skeleton).toHaveClass('overflow-hidden')
    expect(skeleton).toHaveClass('rounded-md')
    expect(skeleton).toHaveClass('bg-muted')
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('renders correctly with custom className', () => {
    render(<Skeleton className="custom-skeleton" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('custom-skeleton')
  })

  it('renders correctly with different animations', () => {
    // Pulse animation (default)
    const { rerender } = render(<Skeleton animation="pulse" />)
    let skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('animate-pulse')

    // Wave animation
    rerender(<Skeleton animation="wave" />)
    skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('animate-skeleton-wave')

    // Shimmer animation
    rerender(<Skeleton animation="shimmer" />)
    skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('animate-skeleton-shimmer')

    // No animation
    rerender(<Skeleton animation="none" />)
    skeleton = screen.getByRole('status')
    expect(skeleton).not.toHaveClass('animate-pulse')
    expect(skeleton).not.toHaveClass('animate-skeleton-wave')
    expect(skeleton).not.toHaveClass('animate-skeleton-shimmer')
  })

  it('renders correctly with gradient', () => {
    render(<Skeleton gradient />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('bg-gradient-to-r')
    expect(skeleton).toHaveClass('from-muted')
    expect(skeleton).toHaveClass('to-muted/80')
  })

  it('passes additional props to the skeleton', () => {
    render(<Skeleton data-testid="custom-skeleton" aria-label="Loading content" />)

    const skeleton = screen.getByTestId('custom-skeleton')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content')
  })
})

describe('SkeletonText Component', () => {
  it('renders correctly with default props', () => {
    render(<SkeletonText />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('h-4')
    expect(skeleton).toHaveClass('w-full')
  })

  it('renders correctly with custom width', () => {
    render(<SkeletonText width="w-1/2" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('w-1/2')
  })

  it('renders correctly with custom height', () => {
    render(<SkeletonText height="h-6" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('h-6')
  })

  it('renders correctly with custom className', () => {
    render(<SkeletonText className="custom-skeleton-text" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('custom-skeleton-text')
  })
})

describe('SkeletonAvatar Component', () => {
  it('renders correctly with default props', () => {
    render(<SkeletonAvatar />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('h-10')
    expect(skeleton).toHaveClass('w-10')
    expect(skeleton).toHaveClass('rounded-full')
  })

  it('renders correctly with custom size', () => {
    render(<SkeletonAvatar size="lg" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('h-12')
    expect(skeleton).toHaveClass('w-12')
  })

  it('renders correctly with custom className', () => {
    render(<SkeletonAvatar className="custom-skeleton-avatar" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('custom-skeleton-avatar')
  })
})

describe('SkeletonButton Component', () => {
  it('renders correctly with default props', () => {
    render(<SkeletonButton />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('h-10')
    expect(skeleton).toHaveClass('w-20')
    expect(skeleton).toHaveClass('rounded-md')
  })

  it('renders correctly with custom size', () => {
    render(<SkeletonButton size="lg" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('h-11')
  })

  it('renders correctly with custom width', () => {
    render(<SkeletonButton width="w-full" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('w-full')
  })

  it('renders correctly with custom className', () => {
    render(<SkeletonButton className="custom-skeleton-button" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('custom-skeleton-button')
  })
})

describe('SkeletonImage Component', () => {
  it('renders correctly with default props', () => {
    render(<SkeletonImage />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('h-40')
    expect(skeleton).toHaveClass('w-full')
    expect(skeleton).toHaveClass('rounded-md')
  })

  it('renders correctly with custom aspect ratio', () => {
    render(<SkeletonImage aspectRatio="square" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('aspect-square')
  })

  it('renders correctly with custom height', () => {
    render(<SkeletonImage height="h-60" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('h-60')
  })

  it('renders correctly with custom className', () => {
    render(<SkeletonImage className="custom-skeleton-image" />)

    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('custom-skeleton-image')
  })
})

describe('SkeletonCard Component', () => {
  it('renders correctly with default props', () => {
    render(<SkeletonCard />)

    // Check that the card container is rendered
    const card = screen.getByTestId('skeleton-card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('rounded-lg')
    expect(card).toHaveClass('border')
    expect(card).toHaveClass('p-4')

    // Check that the image skeleton is rendered
    const image = screen.getByTestId('skeleton-card-image')
    expect(image).toBeInTheDocument()

    // Check that the title skeleton is rendered
    const title = screen.getByTestId('skeleton-card-title')
    expect(title).toBeInTheDocument()

    // Check that the description skeletons are rendered
    const description1 = screen.getByTestId('skeleton-card-description-1')
    const description2 = screen.getByTestId('skeleton-card-description-2')
    expect(description1).toBeInTheDocument()
    expect(description2).toBeInTheDocument()
  })

  it('renders correctly with custom className', () => {
    render(<SkeletonCard className="custom-skeleton-card" />)

    const card = screen.getByTestId('skeleton-card')
    expect(card).toHaveClass('custom-skeleton-card')
  })

  it('renders correctly with hasImage=false', () => {
    render(<SkeletonCard hasImage={false} />)

    // Check that the image skeleton is not rendered
    expect(screen.queryByTestId('skeleton-card-image')).not.toBeInTheDocument()

    // Check that the title and description skeletons are still rendered
    expect(screen.getByTestId('skeleton-card-title')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton-card-description-1')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton-card-description-2')).toBeInTheDocument()
  })

  it('renders correctly with hasFooter=true', () => {
    render(<SkeletonCard hasFooter />)

    // Check that the footer skeleton is rendered
    const footer = screen.getByTestId('skeleton-card-footer')
    expect(footer).toBeInTheDocument()
  })

  it('renders correctly with custom imageHeight', () => {
    render(<SkeletonCard imageHeight="h-60" />)

    const image = screen.getByTestId('skeleton-card-image')
    expect(image).toHaveClass('h-60')
  })
})
