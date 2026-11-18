import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  FamiljenGrotesk_600SemiBold,
  FamiljenGrotesk_700Bold,
} from '@expo-google-fonts/familjen-grotesk';
import {
  GoogleSansFlex_400Regular,
  GoogleSansFlex_500Medium,
  GoogleSansFlex_600SemiBold,
} from '@expo-google-fonts/google-sans-flex';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider, useTheme, type ColorScheme } from '../theme';
import { SavedProductsProvider } from '../context/SavedProductsContext';
import { FollowedCollectionsProvider } from '../context/FollowedCollectionsContext';

// Aktivt tema. Byt till 'light' här för att testa ljust tema (ingen UI för
// det än).
const INITIAL_SCHEME: ColorScheme = 'dark';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    FamiljenGrotesk_600SemiBold,
    FamiljenGrotesk_700Bold,
    GoogleSansFlex_400Regular,
    GoogleSansFlex_500Medium,
    GoogleSansFlex_600SemiBold,
  });

  return (
    <ThemeProvider initialScheme={INITIAL_SCHEME}>
      {fontsLoaded ? <AppShell /> : <FontLoading />}
    </ThemeProvider>
  );
}

function FontLoading() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

function AppShell() {
  const { scheme, colors } = useTheme();
  return (
    <SavedProductsProvider>
      <FollowedCollectionsProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
      </FollowedCollectionsProvider>
    </SavedProductsProvider>
  );
}
