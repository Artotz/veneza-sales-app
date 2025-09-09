import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import i18n from './utils/i18n/i18n';
import { I18nextProvider } from 'react-i18next';
import Navigation from 'navigation/Navigation';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <I18nextProvider i18n={i18n}>
        <Navigation />
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
