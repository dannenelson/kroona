import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  GoogleSansFlex_400Regular,
  GoogleSansFlex_500Medium,
  GoogleSansFlex_700Bold,
} from '@expo-google-fonts/google-sans-flex';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';
import { SavedProductsProvider } from '../context/SavedProductsContext';
import { FollowedCollectionsProvider } from '../context/FollowedCollectionsContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    GoogleSansFlex_400Regular,
    GoogleSansFlex_500Medium,
    GoogleSansFlex_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.gold} />
      </View>
    );
  }

  return (
    <SavedProductsProvider>
      <FollowedCollectionsProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </FollowedCollectionsProvider>
    </SavedProductsProvider>
  );
}