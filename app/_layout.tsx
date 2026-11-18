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
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme, type ColorScheme } from '../theme';
import { SavedProductsProvider } from '../context/SavedProductsContext';
import { FollowedCollectionsProvider } from '../context/FollowedCollectionsContext';
import { ContextMenuProvider } from '../components/ProductContextMenu';

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
    // GestureHandlerRootView krävs av react-native-gesture-handler (långt tryck-menyn).
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <ThemeProvider initialScheme={INITIAL_SCHEME}>
        {fontsLoaded ? <AppShell /> : <FontLoading />}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function FontLoading() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={colors.textSecondary} />
    </View>
  );
}

function AppShell() {
  const { scheme, colors } = useTheme();
  return (
    <SavedProductsProvider>
      <FollowedCollectionsProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {/* Kontextmenyn ritas ovanför alla skärmar (ingen Modal, se ProductContextMenu). */}
        <ContextMenuProvider>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
        </ContextMenuProvider>
      </FollowedCollectionsProvider>
    </SavedProductsProvider>
  );
}
