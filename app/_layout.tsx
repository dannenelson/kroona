import { useEffect, useMemo } from 'react';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { BlankStack } from 'react-native-screen-transitions/expo-router';
import {
  collectionScreenOptions,
  installDismissThresholds,
  lightboxScreenOptions,
  partnerScreenOptions,
  productScreenOptions,
  tabsScreenOptions,
} from '../components/product/productTransition';
import { installReduceMotionSync } from '../lib/lightboxStore';
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
  // Tröskel för distansbaserad stängning av Produktdetalj (patchat bibliotek).
  useEffect(() => installDismissThresholds(), []);
  useEffect(() => installReduceMotionSync(), []);
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
            {/* Spik (brief 18): blank stack från react-native-screen-transitions.
                Skärmarna är JS-vyer, så föregående skärm finns kvar bakom när
                Produktdetalj dras. Flikarna (skärm 1) behåller sin senaste bild
                ('pause') så att de syns bakom. */}
            <BlankStack>
              <BlankStack.Screen name="(tabs)" options={tabsScreenOptions} />
              <BlankStack.Screen name="product/[id]" options={productScreenOptions} />
              <BlankStack.Screen name="collection/[id]" options={collectionScreenOptions} />
              <BlankStack.Screen name="partner/[id]" options={partnerScreenOptions} />
              <BlankStack.Screen name="lightbox/[id]" options={lightboxScreenOptions} />
            </BlankStack>
          </ToastProvider>
        </ContextMenuProvider>
      </FollowedCollectionsProvider>
    </SavedProductsProvider>
    </View>
    </NavigationThemeProvider>
  );
}
