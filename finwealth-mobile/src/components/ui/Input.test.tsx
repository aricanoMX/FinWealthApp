import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';

describe('<Input />', () => {
  it('renders correctly with label', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Email" placeholder="Enter email" />,
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('displays error message when provided', () => {
    const { getByText } = render(<Input label="Password" error="Password is required" />);
    expect(getByText('Password is required')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input label="Email" placeholder="Enter email" onChangeText={mockOnChangeText} />,
    );

    const input = getByPlaceholderText('Enter email');
    fireEvent.changeText(input, 'test@example.com');

    expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
  });
});
