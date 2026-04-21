import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import FadeInView from './FadeInView';

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Add missing mocks for the timing/delay functions if needed
  Reanimated.withDelay = jest.fn((_delay, animation) => animation);
  Reanimated.withTiming = jest.fn((toValue) => toValue);
  Reanimated.Easing = {
    out: jest.fn(() => ({})),
    exp: jest.fn(() => ({})),
    bezier: jest.fn(() => ({})),
  };

  return Reanimated;
});

describe('FadeInView', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <FadeInView>
        <Text>Test Animation</Text>
      </FadeInView>,
    );
    expect(getByText('Test Animation')).toBeTruthy();
  });

  it('applies the passed style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <FadeInView style={customStyle} testID="fade-in-view">
        <Text>Styled View</Text>
      </FadeInView>,
    );

    // In many RN testing setups, Animated.View might be rendered as a View
    const view = getByTestId('fade-in-view');
    expect(view.props.style).toContainEqual(customStyle);
  });
});
