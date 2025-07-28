import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { theme } from '../styles/theme';
import styles from './SplashScreen.styles';

interface SplashScreenProps {
  onLoadingComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onLoadingComplete }) => {
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
        animating={true}
      />

      <Text style={styles.loadingText}>앱을 준비 중입니다...</Text>
    </View>
  );
};

export default SplashScreen;
