import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SoundService } from './src/services/SoundService';

export default function App() {
  useEffect(() => {
    SoundService.preload();
    return () => SoundService.unloadAll();
  }, []);
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <View style={styles.container}>
          <RootNavigator />
          <StatusBar style="light" />
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080A1A',
  },
});
