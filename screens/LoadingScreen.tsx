import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { theme } from '../styles/theme';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>TodoApp</Text>
      <Text style={styles.subtitle}>할 일을 스마트하게 관리하세요</Text>
      
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary}
      />
      
      <Text style={styles.loadingText}>앱을 준비 중입니다...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  appName: {
    fontSize: theme.typography.size.title,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xxxl * 2,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxl,
  },
});

export default LoadingScreen;