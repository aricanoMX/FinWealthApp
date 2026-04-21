import React, { memo, useMemo } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../../theme/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input = memo(({ label, error, style, ...props }: InputProps) => {
  const inputStyle = useMemo(
    () => [styles.input, error ? styles.inputError : null, style],
    [error, style],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={inputStyle} placeholderTextColor={theme.colors.textMuted} {...props} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[16],
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: theme.spacing[8],
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.textMuted,
    borderRadius: 8,
    paddingHorizontal: theme.spacing[16],
    paddingVertical: theme.spacing[12],
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing[4],
  },
});
