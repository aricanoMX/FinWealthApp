import React, { memo, useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../../theme/theme';

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
        <ActivityIndicator testID="loading-indicator" color={theme.colors.text} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[16],
    paddingHorizontal: theme.spacing[24],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
