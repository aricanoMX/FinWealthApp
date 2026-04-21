import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useAppStore } from '../src/store/app.store';

export default function Home() {
  const isInitialized = useAppStore((state) => state.isInitialized);
  const setInitialized = useAppStore((state) => state.setInitialized);

  return (
    <View style={styles.container}>
      {isInitialized ? (
        <Text>FinWealth App is Ready!</Text>
      ) : (
        <View style={styles.content}>
          <Text>FinWealth App is initializing...</Text>
          <Button title="Initialize" onPress={() => setInitialized(true)} />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
