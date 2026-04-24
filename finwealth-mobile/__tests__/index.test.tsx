import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Home from '../app/index';
import { useAppStore } from '../src/store/app.store';

describe('<Home />', () => {
  beforeEach(() => {
    useAppStore.setState({ isInitialized: false });
  });

  it('renders correctly initially with uninitialized state', () => {
    render(<Home />);
    expect(screen.getByText('Inicializando el motor de riqueza...')).toBeTruthy();
  });

  it('updates state when initialized button is pressed', () => {
    render(<Home />);

    const button = screen.getByText('Comenzar Experiencia Elite');
    fireEvent.press(button);

    expect(useAppStore.getState().isInitialized).toBe(true);
  });
});
