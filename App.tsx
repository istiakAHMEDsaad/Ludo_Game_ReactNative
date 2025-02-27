import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { GameProvider } from './src/context/GameContext';
import GameScreen from './src/screens/GameScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar style='auto' />
        <GameScreen />
      </GameProvider>
    </SafeAreaProvider>
  );
}

