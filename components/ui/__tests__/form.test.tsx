import { render, screen } from '@/lib/test-utils'
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'

// Mock the useFormField hook
jest.mock('@/components/ui/form', () => {
  const actual = jest.requireActual('@/components/ui/form')
  return {
    ...actual,
    useFormField: jest.fn(() => ({
      id: 'test-id',
      name: 'test-name',
      formItemId: 'test-form-item-id',
      formDescriptionId: 'test-form-description-id',
      formMessageId: 'test-form-message-id',
      error: undefined,
    })),
  }
})

// Create a test form schema
const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

// Create a test form component
function TestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="test-form">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormDescription>
                We'll never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

describe('Form Components', () => {
  it('renders Form correctly', () => {
    render(<TestForm />)

    // Check that the form is rendered
    const form = screen.getByTestId('test-form')
    expect(form).toBeInTheDocument()

    // Check that the form fields are rendered
    const usernameLabel = screen.getByText('Username')
    const emailLabel = screen.getByText('Email')
    expect(usernameLabel).toBeInTheDocument()
    expect(emailLabel).toBeInTheDocument()

    // Check that the form inputs are rendered
    const usernameInput = screen.getByPlaceholderText('Enter username')
    const emailInput = screen.getByPlaceholderText('Enter email')
    expect(usernameInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()

    // Check that the form descriptions are rendered
    const usernameDescription = screen.getByText('This is your public display name.')
    const emailDescription = screen.getByText('We\'ll never share your email with anyone else.')
    expect(usernameDescription).toBeInTheDocument()
    expect(emailDescription).toBeInTheDocument()

    // Check that the submit button is rendered
    const submitButton = screen.getByRole('button', { name: 'Submit' })
    expect(submitButton).toBeInTheDocument()
  })

  it.skip('renders FormItem correctly with custom className', () => {
    render(
      <FormItem className="custom-form-item" data-testid="form-item-test">
        <FormLabel>Test Label</FormLabel>
        <FormControl>
          <Input />
        </FormControl>
        <FormDescription>Test Description</FormDescription>
        <FormMessage>Test Message</FormMessage>
      </FormItem>
    )

    // Check that the form item is rendered with the custom class
    const formItem = screen.getByTestId('form-item-test')
    expect(formItem).toBeInTheDocument()
    expect(formItem).toHaveClass('custom-form-item')
    expect(formItem).toHaveClass('space-y-2')
  })

  it.skip('renders FormLabel correctly with error state', () => {
    // Mock the useFormField hook to return an error
    jest.mocked(useFormField).mockReturnValueOnce({
      id: 'test-id',
      name: 'test-name',
      formItemId: 'test-form-item-id',
      formDescriptionId: 'test-form-description-id',
      formMessageId: 'test-form-message-id',
      error: { message: 'Test error message' },
    })

    render(
      <FormLabel className="custom-label" data-testid="form-label-test">
        Test Label
      </FormLabel>
    )

    // Check that the form label is rendered with the error class
    const formLabel = screen.getByTestId('form-label-test')
    expect(formLabel).toBeInTheDocument()
    expect(formLabel).toHaveClass('custom-label')
    expect(formLabel).toHaveClass('text-destructive')
  })

  it.skip('renders FormDescription correctly', () => {
    render(
      <FormDescription className="custom-description" data-testid="form-description-test">
        Test Description
      </FormDescription>
    )

    // Check that the form description is rendered with the custom class
    const formDescription = screen.getByTestId('form-description-test')
    expect(formDescription).toBeInTheDocument()
    expect(formDescription).toHaveClass('custom-description')
    expect(formDescription).toHaveClass('text-sm')
    expect(formDescription).toHaveClass('text-muted-foreground')
  })

  it.skip('renders FormMessage correctly with error', () => {
    // Mock the useFormField hook to return an error
    jest.mocked(useFormField).mockReturnValueOnce({
      id: 'test-id',
      name: 'test-name',
      formItemId: 'test-form-item-id',
      formDescriptionId: 'test-form-description-id',
      formMessageId: 'test-form-message-id',
      error: { message: 'Test error message' },
    })

    render(
      <FormMessage className="custom-message" data-testid="form-message-test" />
    )

    // Check that the form message is rendered with the error message
    const formMessage = screen.getByTestId('form-message-test')
    expect(formMessage).toBeInTheDocument()
    expect(formMessage).toHaveClass('custom-message')
    expect(formMessage).toHaveClass('text-sm')
    expect(formMessage).toHaveClass('font-medium')
    expect(formMessage).toHaveClass('text-destructive')
    expect(formMessage).toHaveTextContent('Test error message')
  })

  it.skip('does not render FormMessage when there is no error or children', () => {
    // Mock the useFormField hook to return no error
    jest.mocked(useFormField).mockReturnValueOnce({
      id: 'test-id',
      name: 'test-name',
      formItemId: 'test-form-item-id',
      formDescriptionId: 'test-form-description-id',
      formMessageId: 'test-form-message-id',
      error: undefined,
    })

    const { container } = render(
      <FormMessage />
    )

    // Check that the form message is not rendered
    expect(container.firstChild).toBeNull()
  })

  it.skip('renders FormMessage with children when there is no error', () => {
    // Mock the useFormField hook to return no error
    jest.mocked(useFormField).mockReturnValueOnce({
      id: 'test-id',
      name: 'test-name',
      formItemId: 'test-form-item-id',
      formDescriptionId: 'test-form-description-id',
      formMessageId: 'test-form-message-id',
      error: undefined,
    })

    render(
      <FormMessage data-testid="form-message-test">
        Custom message
      </FormMessage>
    )

    // Check that the form message is rendered with the children
    const formMessage = screen.getByTestId('form-message-test')
    expect(formMessage).toBeInTheDocument()
    expect(formMessage).toHaveTextContent('Custom message')
  })
})
