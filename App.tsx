import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleLoadingComplete = (): void => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <HomeScreen />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 16,
  },
  subText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});