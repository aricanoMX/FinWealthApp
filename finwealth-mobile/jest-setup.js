// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  class AnimatedView extends React.Component {
    render() {
      return React.createElement(View, this.props, this.props.children);
    }
  }

  const Animated = {
    View: AnimatedView,
    Text: AnimatedView, // Simple mock for Text too
    createAnimatedComponent: jest.fn((component) => component),
    useSharedValue: jest.fn((v) => ({ value: v })),
    useAnimatedStyle: jest.fn(() => ({})),
    useAnimatedProps: jest.fn(() => ({})),
    useDerivedValue: jest.fn((v) => ({ value: v })),
    useAnimatedScrollHandler: jest.fn(() => ({})),
    withDelay: jest.fn((_delay, animation) => animation),
    withTiming: jest.fn((toValue) => toValue),
    withSpring: jest.fn((toValue) => toValue),
    Easing: {
      out: jest.fn((v) => v),
      exp: jest.fn((v) => v),
      bezier: jest.fn((v) => v),
      in: jest.fn((v) => v),
      inOut: jest.fn((v) => v),
      linear: jest.fn((v) => v),
      quad: jest.fn((v) => v),
      cubic: jest.fn((v) => v),
      poly: jest.fn((v) => v),
      sin: jest.fn((v) => v),
      circle: jest.fn((v) => v),
      bounce: jest.fn((v) => v),
      back: jest.fn((v) => v),
      elastic: jest.fn((v) => v),
    },
  };

  return {
    __esModule: true,
    ...Animated,
    default: Animated,
  };
});

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => ([]),
  Link: ({ children }) => children,
  Redirect: () => null,
  Stack: ({ children }) => children,
  Tabs: ({ children }) => children,
}));

// Mock Expo Constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiUrl: 'http://localhost:3000',
    },
  },
}));

// Mock Expo Secure Store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
