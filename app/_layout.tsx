import { useMemo } from 'react';
import { Stack, ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
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
import { ToastProvider } from '../components/Toast';

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
  // Navigationens tema följer vårt tema (spik brief 16): native-stackens
  // container får sin bakgrund härifrån och syns bakom en skärm som krymper
  // (zoom-stängning). Utan detta syntes standardtemats ljusa grå.
  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return { ...base, colors: { ...base.colors, background: colors.bg, card: colors.bg } };
  }, [scheme, colors.bg]);
  return (
    <NavigationThemeProvider value={navigationTheme}>
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
    <SavedProductsProvider>
      <FollowedCollectionsProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {/* Kontextmenyn ritas ovanför alla skärmar (ingen Modal, se ProductContextMenu). */}
        <ContextMenuProvider>
          {/* Tillfälliga bekräftelser (toast) ovanför alla skärmar. */}
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
          </ToastProvider>
        </ContextMenuProvider>
      </FollowedCollectionsProvider>
    </SavedProductsProvider>
    </View>
    </NavigationThemeProvider>
  );
}
