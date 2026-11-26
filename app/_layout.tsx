import { useEffect, useMemo } from 'react';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { BlankStack } from 'react-native-screen-transitions/expo-router';
import {
  collectionScreenOptions,
  installDismissThresholds,
  lightboxScreenOptions,
  partnerScreenOptions,
  profileScreenOptions,
  productScreenOptions,
  pushScreenOptions,
  searchScreenOptions,
  slideFromLeftScreenOptions,
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
import { ThemeProvider, useTheme } from '../theme';
import { NotificationsProvider } from '../context/NotificationsContext';
import { SavedProductsProvider } from '../context/SavedProductsContext';
import { FollowedCollectionsProvider } from '../context/FollowedCollectionsContext';
import { UserCollectionsProvider } from '../context/UserCollectionsContext';
import { FollowedPeopleProvider } from '../context/FollowedPeopleContext';
import { ContextMenuProvider } from '../components/ProductContextMenu';
import { SnackbarProvider } from '../components/Snackbar';
import { SheetProvider } from '../components/Sheet';

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
      {/* Tema (brief 64): Ljust / Mörkt / System väljs i Inställningar och sparas lokalt. */}
      <ThemeProvider defaultPreference="dark">
        <ThemeGate fontsLoaded={fontsLoaded} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

/** Väntar på typsnitten och det sparade temavalet, så att fel tema inte blinkar vid start. */
function ThemeGate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { ready } = useTheme();
  return fontsLoaded && ready ? <AppShell /> : <FontLoading />;
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
      <UserCollectionsProvider>
      <FollowedCollectionsProvider>
      <FollowedPeopleProvider>
      <NotificationsProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {/* Kontextmenyn ritas ovanför alla skärmar (ingen Modal, se ProductContextMenu). */}
        <ContextMenuProvider>
          {/* Bekräftelser (snackbar, brief 33) ovanför alla skärmar och lager. */}
          <SnackbarProvider>
          {/* Helskärmslager för miniflöden (Sheet, brief 33). */}
          <SheetProvider>
            {/* Spik (brief 18): blank stack från react-native-screen-transitions.
                Skärmarna är JS-vyer, så föregående skärm finns kvar bakom när
                Produktdetalj dras. Flikarna (skärm 1) behåller sin senaste bild
                ('pause') så att de syns bakom. */}
            <BlankStack>
              <BlankStack.Screen name="(tabs)" options={tabsScreenOptions} />
              <BlankStack.Screen name="product/[id]" options={productScreenOptions} />
              <BlankStack.Screen name="collection/[id]" options={collectionScreenOptions} />
              <BlankStack.Screen name="partner/[id]" options={partnerScreenOptions} />
              <BlankStack.Screen name="profile/[id]" options={profileScreenOptions} />
              <BlankStack.Screen name="lightbox/[id]" options={lightboxScreenOptions} />
              {/* Hitta (brief 53): sökläge, sökresultat och dialog, utan flikfält. */}
              <BlankStack.Screen name="search" options={searchScreenOptions} />
              <BlankStack.Screen name="results" options={pushScreenOptions} />
              <BlankStack.Screen name="dialog" options={pushScreenOptions} />
              {/* Brief 54: kategorier, områden och idéer. */}
              <BlankStack.Screen name="category/[id]" options={pushScreenOptions} />
              <BlankStack.Screen name="categories" options={pushScreenOptions} />
              <BlankStack.Screen name="areas" options={pushScreenOptions} />
              <BlankStack.Screen name="area/[id]" options={pushScreenOptions} />
              <BlankStack.Screen name="ideas" options={pushScreenOptions} />
              {/* Brief 64: egen profil (från avataren, glider in från vänster),
                  notiser (från klockan, från höger), inställningar, platshållare och dev-sidan. */}
              <BlankStack.Screen name="me" options={slideFromLeftScreenOptions} />
              <BlankStack.Screen name="notifications" options={pushScreenOptions} />
              <BlankStack.Screen name="settings" options={pushScreenOptions} />
              <BlankStack.Screen name="placeholder" options={pushScreenOptions} />
              <BlankStack.Screen name="components" options={pushScreenOptions} />
            </BlankStack>
          </SheetProvider>
          </SnackbarProvider>
        </ContextMenuProvider>
      </NotificationsProvider>
      </FollowedPeopleProvider>
      </FollowedCollectionsProvider>
      </UserCollectionsProvider>
    </SavedProductsProvider>
    </View>
    </NavigationThemeProvider>
  );
}
