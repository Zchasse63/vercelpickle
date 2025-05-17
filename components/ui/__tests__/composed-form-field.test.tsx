import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import { FormField } from '@/components/ui/composed-form-field';

describe('FormField Component', () => {
  it('renders correctly with default props', () => {
    render(<FormField name="test" label="Test Field" />);
    
    expect(screen.getByTestId('form-field-label')).toHaveTextContent('Test Field');
    expect(screen.getByTestId('form-field-input')).toBeInTheDocument();
    expect(screen.queryByTestId('form-field-message')).not.toBeInTheDocument();
  });
  
  it('renders correctly with error message', () => {
    render(<FormField name="test" label="Test Field" error="This field is required" />);
    
    expect(screen.getByTestId('form-field-label')).toHaveTextContent('Test Field');
    expect(screen.getByTestId('form-field-input')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-message')).toHaveTextContent('This field is required');
  });
  
  it('handles input changes correctly', () => {
    const handleChange = jest.fn();
    
    render(
      <FormField 
        name="test" 
        label="Test Field" 
        onChange={handleChange} 
      />
    );
    
    const input = screen.getByTestId('form-field-input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });
  
  it('applies error styling to input when error is provided', () => {
    render(<FormField name="test" label="Test Field" error="This field is required" />);
    
    const input = screen.getByTestId('form-field-input');
    expect(input).toHaveClass('border-destructive');
  });
  
  it('applies disabled styling when disabled', () => {
    render(<FormField name="test" label="Test Field" disabled />);
    
    const input = screen.getByTestId('form-field-input');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveClass('disabled:opacity-50');
  });
  
  it('passes additional props to the input', () => {
    render(
      <FormField 
        name="test" 
        label="Test Field" 
        placeholder="Enter value" 
        maxLength={10} 
      />
    );
    
    const input = screen.getByTestId('form-field-input');
    expect(input).toHaveAttribute('placeholder', 'Enter value');
    expect(input).toHaveAttribute('maxLength', '10');
  });
});
