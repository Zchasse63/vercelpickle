import { render, screen, fireEvent, waitFor } from '@/lib/test-utils'
import { AdminTransactionHistory } from '@/components/admin/admin-transaction-history'

// Mock the window.URL.createObjectURL function
window.URL.createObjectURL = jest.fn(() => 'mock-url')

describe('AdminTransactionHistory Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  it('renders correctly with default state', () => {
    render(<AdminTransactionHistory />)

    // Check if the component title is rendered
    expect(screen.getByText('Transaction History')).toBeInTheDocument()

    // Check if the search input is rendered
    expect(screen.getByPlaceholderText('Search transactions...')).toBeInTheDocument()

    // Check if the status filter is rendered
    expect(screen.getByText('Status')).toBeInTheDocument()

    // Check if the export button is rendered
    expect(screen.getByText('Export')).toBeInTheDocument()

    // Check if the table headers are rendered
    expect(screen.getByText('Transaction ID')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Seller')).toBeInTheDocument()
    expect(screen.getByText('Buyer')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Platform Fee')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()

    // Check if at least one transaction is rendered
    expect(screen.getByText('TX-1234')).toBeInTheDocument()
  })

  it('filters transactions based on search term', async () => {
    render(<AdminTransactionHistory />)

    // Get the search input
    const searchInput = screen.getByPlaceholderText('Search transactions...')

    // Type in the search input
    fireEvent.change(searchInput, { target: { value: 'Dairy' } })

    // Check if the filtered transaction is rendered
    expect(screen.getByText('TX-1235')).toBeInTheDocument()

    // Check if other transactions are not rendered
    expect(screen.queryByText('TX-1234')).not.toBeInTheDocument()
  })

  it.skip('filters transactions based on status', async () => {
    render(<AdminTransactionHistory />)

    // Open the status filter dropdown
    fireEvent.click(screen.getByText('Status'))

    // Select the "Processing" status
    fireEvent.click(screen.getByText('Processing'))

    // Check if the filtered transaction is rendered
    expect(screen.getByText('TX-1236')).toBeInTheDocument()

    // Check if other transactions are not rendered
    expect(screen.queryByText('TX-1234')).not.toBeInTheDocument()
  })

  it.skip('filters transactions based on type', async () => {
    render(<AdminTransactionHistory />)

    // Open the type filter dropdown
    fireEvent.click(screen.getByText('Type'))

    // Select the "Payout" type
    fireEvent.click(screen.getByText('Payout'))

    // Check if the filtered transaction is rendered
    expect(screen.getByText('TX-1240')).toBeInTheDocument()

    // Check if other transactions are not rendered
    expect(screen.queryByText('TX-1234')).not.toBeInTheDocument()
  })

  it.skip('exports transactions as CSV when export button is clicked', async () => {
    // Mock document.createElement and appendChild
    const mockLink = {
      setAttribute: jest.fn(),
      style: {},
      click: jest.fn(),
    }
    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === 'a') return mockLink
      return {}
    })
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()

    render(<AdminTransactionHistory />)

    // Click the export button
    fireEvent.click(screen.getByText('Export'))

    // Check if the link was created with the correct attributes
    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url')
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', expect.stringMatching(/transactions-.*\.csv/))

    // Check if the link was clicked
    expect(mockLink.click).toHaveBeenCalled()

    // Check if the link was removed from the document
    expect(document.body.removeChild).toHaveBeenCalled()
  })

  it.skip('paginates transactions correctly', async () => {
    render(<AdminTransactionHistory />)

    // Check if the pagination is rendered
    expect(screen.getByText('1')).toBeInTheDocument()

    // Click the next page button
    fireEvent.click(screen.getByLabelText('Go to next page'))

    // Check if the page number is updated
    expect(screen.getByText('2')).toBeInTheDocument()

    // Click the previous page button
    fireEvent.click(screen.getByLabelText('Go to previous page'))

    // Check if the page number is updated
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
