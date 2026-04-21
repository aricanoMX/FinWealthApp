import React, { memo, useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

export const Button = memo(({ title, isLoading, style, disabled, ...props }: ButtonProps) => {
  const combinedStyle = useMemo(
    () => [styles.button, (disabled || isLoading) && styles.disabled, style],
    [disabled, isLoading, style],
  );

  return (
    <TouchableOpacity style={combinedStyle} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <ActivityIndicator testID="loading-indicator" color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
