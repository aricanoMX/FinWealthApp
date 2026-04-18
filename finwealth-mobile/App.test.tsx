import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import App from './App';
import { useAppStore } from './src/store/app.store';

describe('<App />', () => {
  beforeEach(() => {
    useAppStore.setState({ isInitialized: false });
  });

  it('renders correctly initially with uninitialized state', () => {
    render(<App />);
    expect(screen.getByText('FinWealth App is initializing...')).toBeTruthy();
  });

  it('updates text when initialized button is pressed', () => {
    render(<App />);
    
    // Simulate user or system initializing the app
    const button = screen.getByText('Initialize');
    fireEvent.press(button);

    expect(screen.getByText('FinWealth App is Ready!')).toBeTruthy();
  });
});
