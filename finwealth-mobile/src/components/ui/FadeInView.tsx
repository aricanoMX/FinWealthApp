import React, { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface FadeInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  testID?: string;
}

/**
 * FadeInView provides a standard entrance animation for screen layouts.
 * It animates opacity from 0 to 1 and Y-axis translation from 20 to 0.
 *
 * @param children - React components to be wrapped by the animation
 * @param style - Optional style for the Animated.View container
 * @param delay - Delay in milliseconds before the animation starts
 * @param testID - Optional test identifier for testing purposes
 */
const FadeInView: React.FC<FadeInViewProps> = ({ children, style, delay = 0, testID }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: 700,
        easing: Easing.out(Easing.exp),
      }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration: 700,
        easing: Easing.out(Easing.exp),
      }),
    );
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]} testID={testID}>
      {children}
    </Animated.View>
  );
};

export default FadeInView;
