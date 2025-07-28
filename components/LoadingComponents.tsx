// components/LoadingCard.tsx
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../styles/theme';

interface LoadingCardProps {
  message?: string;
  size?: 'small' | 'large';
  minHeight?: number;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  message = '로딩 중...',
  size = 'small',
  minHeight = 120,
}) => {
  return (
    <View style={[styles.loadingContainer, { minHeight }]}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {message && <Text style={styles.loadingText}>{message}</Text>}
    </View>
  );
};

// components/LoadingSection.tsx
interface LoadingSectionProps {
  message?: string;
  backgroundColor?: string;
  paddingVertical?: number;
}

export const LoadingSection: React.FC<LoadingSectionProps> = ({
  message = '데이터를 불러오는 중...',
  backgroundColor = theme.colors.surface,
  paddingVertical = theme.spacing.xxxl,
}) => {
  return (
    <View
      style={[
        styles.sectionContainer,
        {
          backgroundColor,
          paddingVertical,
        },
      ]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && <Text style={styles.sectionText}>{message}</Text>}
    </View>
  );
};

// components/LoadingButton.tsx
interface LoadingButtonProps {
  isLoading: boolean;
  onPress: () => void;
  loadingText?: string;
  normalText?: string;
  style?: any;
  disabled?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  onPress,
  loadingText = '로딩 중...',
  normalText = '버튼',
  style,
  disabled = false,
}) => {
  const isDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text
        style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}
      >
        {isLoading ? loadingText : normalText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // LoadingCard 스타일
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // LoadingSection 스타일
  sectionContainer: {
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // LoadingButton 스타일
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
  },
  buttonTextDisabled: {
    color: theme.colors.text.secondary,
  },
});
