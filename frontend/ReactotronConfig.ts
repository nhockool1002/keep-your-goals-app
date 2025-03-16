import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Default localhost for Expo Go (iOS uses a different localhost)
const getHost = () => {
  if (Platform.OS === 'ios') return 'localhost';
  return '192.168.1.2'; // Replace with your machine's local IP
};

const reactotron = Reactotron
  .setAsyncStorageHandler(AsyncStorage) // Required for Expo
  .configure({ host: getHost() }) // Manually set the host
  .useReactNative()
  .connect();

// Extend console for Reactotron
if (__DEV__) {
  console.tron = reactotron;
  console.tron.log('✅ Reactotron is connected to Expo!');
}

export default reactotron;
