import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('<Button />', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Login" onPress={() => {}} />);
    expect(getByText('Login')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<Button title="Submit" onPress={mockPress} />);

    fireEvent.press(getByText('Submit'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('shows ActivityIndicator and disables press when isLoading is true', () => {
    const mockPress = jest.fn();
    const { getByTestId, queryByText } = render(
      <Button title="Submit" isLoading={true} onPress={mockPress} />,
    );

    // Title should be hidden
    expect(queryByText('Submit')).toBeNull();

    // ActivityIndicator should be shown
    expect(getByTestId('loading-indicator')).toBeTruthy();

    // Should not trigger onPress when loading
    fireEvent.press(getByTestId('loading-indicator').parent as any);
    expect(mockPress).not.toHaveBeenCalled();
  });
});
