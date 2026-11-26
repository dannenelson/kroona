import { useId, useMemo, useRef, useState, type ComponentRef } from 'react';
import { useRouter } from 'expo-router';
import Transition from 'react-native-screen-transitions';
import { PRODUCT_BOUNDARY_GROUP } from './product/productTransition';
import { Animated, StyleSheet, View, Text, Pressable, Image, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { makeStyles, overlay, typography, letterSpacing, spacing, radius, motion, productCard } from '../theme';
import { useCardPress } from '../hooks/useCardPress';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { useContextMenu, type ContextMenuItem } from './ProductContextMenu';
import ProductCardText from './ProductCardText';
import { useSaveActions } from './saved/SaveSheet';

export type ProductCardSize = 'S' | 'M' | 'L';

type Props = {
  id: string;
  brand: string;
  name: string;
  price: number;
  imageUrl: string;
  sustainabilityScore: number;
  isNew?: boolean;
  isUsed?: boolean;
  featured?: boolean;
  aspectRatio?: number;
  // När satt: bilden får en FAST höjd istället för aspectRatio-driven
  // masonry-höjd. Till för horisontella rader (t.ex. RecommendedProductsRow)
  // där alla kort ska ha samma höjd — masonry hör bara hemma i grid-kontext
  // (ProductGrid/Följer/Sparat), inte i en scroll-rad.
  fixedHeight?: number;
  /** S = bara bild (radie tile), M och L = bild + text under (radie card). */
  size?: ProductCardSize;
  /** Kundbetyg. Visas bara när det finns (produktdata saknar det i Fas 0). */
  rating?: number;
  reviewCount?: number;
  onPress?: () => void;
  /** Långt tryck öppnar menyn Spara · Följ varumärke · Dela · Visa liknande. */
  menu?: boolean;
  disabled?: boolean;
  // Heter inte `style`: produktdata har ett eget fält `style` (Minimalistisk
  // osv.) och skickas in med spread. Slås ihop sist enligt kontraktet.
  containerStyle?: StyleProp<ViewStyle>;
  /** Spara-knapp (bokmärke) till höger om texten, en-kolumnsflödet i Följer (brief 59).
   *  Tryck = snabbspar till Sparade produkter (som "Spara" i menyn), långt tryck = "Spara i …". */
  saveButton?: boolean;
};


/**
 * ProductCard enligt referensen "Kroona Looken A" och design.md §0/§4. Bara
 * bilden är rundad (squircle), texten ligger under utan bakgrund.
 * Ingen Spara-knapp på kortet: Spara m.fl. ligger i menyn vid långt tryck
 * (undantag: `saveButton` i en-kolumnsflödet på Följer, brief 59).
 * States: default, pressed (skala 0,96, animerat), disabled (35 % opacitet).
 */
export default function ProductCard({
  id,
  brand,
  name,
  price,
  imageUrl,
  sustainabilityScore,
  isNew,
  isUsed,
  featured,
  aspectRatio,
  fixedHeight,
  size = 'M',
  rating,
  reviewCount,
  onPress,
  menu = true,
  disabled = false,
  containerStyle,
  saveButton = false,
}: Props) {
  const styles = useStyles();
  // Spara (brief 41): "Spara" = snabbspar till Sparade produkter ("Sparad" när
  // den ligger där), "Spara i samling" = kortet "Spara i …". Fyllt bokmärke när
  // produkten ligger i Sparade produkter eller i någon samling.
  const save = useSaveActions(id);
  const cardRef = useRef<ComponentRef<typeof View>>(null);
  const contextMenu = useContextMenu();
  // Standard: öppna Produktdetalj, där kortets bild zoomar till heron (brief 13,
  // spik brief 18). Skickar anroparen egen onPress används den, utan zoom.
  const navigates = onPress === undefined;
  const router = useRouter();
  // Unikt boundary-id per kortinstans: samma produkt kan ligga på flera ställen
  // samtidigt (hyllor, Liknande, Sparat, Hitta), och zoomen ska gå från/till
  // exakt det kort man tryckte på. Skickas till detaljvyn som param `b`.
  // Avgränsare `_`, inte `:` (biblioteket tolkar `:` som grupp:id).
  const instanceKey = useId().replace(/[^a-zA-Z0-9]/g, '');
  const boundaryId = `${id}_${instanceKey}`;
  const handlePress =
    onPress ?? (() => router.push({ pathname: '/product/[id]', params: { id, b: boundaryId } }));
  // Samma source-objekt för originalet och menyns kopia (samma bildcache).
  const imageSource = useMemo(() => ({ uri: imageUrl }), [imageUrl]);

  // Kortens tryckrespons, delad med samlingskorten (hooks/useCardPress).
  const press = useCardPress();
  // Bildytans storlek ur layout (utan transform), för menyns kopia.
  const imageSize = useRef({ width: 0, height: 0 });
  // Medan menyn är öppen syns bara den lyfta kopian, inte originalbilden.
  const [imageHidden, setImageHidden] = useState(false);

  const isSmall = size === 'S';
  const isLarge = size === 'L';


  // Följ varumärke, Dela och Visa liknande har ingen logik i Fas 0-steget,
  // de stänger bara menyn.
  const menuItems: ContextMenuItem[] = [
    { label: save.inSavedProducts ? 'Sparad' : 'Spara', icon: 'bookmark', filled: save.saved, onPress: save.quickSave },
    { label: 'Spara i samling', icon: 'folder-add', onPress: save.openSheet },
    { label: 'Följ varumärke', icon: 'company-add' },
    { label: 'Dela', icon: 'share' },
    { label: 'Visa liknande', icon: 'layers' },
  ];

  // Mäter bilden utan tryck-skalan: Pressable bär ingen transform (skalan
  // ligger på det inre Animated.View) och bildytan ligger överst i kortet,
  // så läget tas från Pressable och storleken från bildytans layout.
  const measureImage = (done: (rect: { x: number; y: number; width: number; height: number }) => void) => {
    cardRef.current?.measureInWindow((x, y) => done({ x, y, ...imageSize.current }));
  };

  const setOriginalHidden = (hidden: boolean) => {
    if (!hidden) press.menuClosed();
    setImageHidden(hidden);
  };

  const badgeLabel = !isSmall && (isNew || isUsed) ? (isUsed ? 'Begagnad' : 'Nyhet') : null;
  const renderBadge = () =>
    badgeLabel ? (
      // Avvikelse från komponentsidan: badgen behålls (Daniels beslut).
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeLabel}</Text>
      </View>
    ) : null;

  const openMenu = () => {
    // Kortet går direkt till skala 1 (ingen fjäder), så kopian börjar och
    // slutar i exakt originalstorlek.
    press.liftForMenu();
    measureImage((anchor) =>
      contextMenu.open({
        anchor,
        imageSource,
        imageRadius: isSmall ? radius.tile : radius.card,
        liftScale: isLarge ? motion.liftScaleLarge : motion.liftScale,
        renderOverlay: renderBadge,
        items: menuItems,
        measure: measureImage,
        setOriginalHidden,
      }),
    );
  };

  // Långt tryck som övergår i drag (brief 05): gesten stannar på kortet så att
  // fingret kan dras till en menyrad. När den aktiveras avbryts kortets
  // Pressable (inget onPress), och listan bakom tar inte över touchen.
  const longPress = usePanGesture({
    activateAfterLongPress: motion.longPressMs,
    enabled: menu && !disabled,
    runOnJS: true,
    disableReanimated: true,
    onActivate: () => openMenu(),
    onUpdate: (e) => contextMenu.move(e.absoluteX, e.absoluteY),
    onDeactivate: () => contextMenu.release(),
  });

  const imageBlock = (
    <View
      onLayout={(e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        imageSize.current = { width, height };
      }}
      style={StyleSheet.flatten([
        styles.imageContainer,
        isSmall && styles.imageContainerSmall,
        fixedHeight ? { height: fixedHeight } : { aspectRatio: aspectRatio ?? 3 / 4 },
        imageHidden && styles.hidden,
      ])}
    >
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      {renderBadge()}
    </View>
  );

  const card = (
      <Pressable
        ref={cardRef}
        collapsable={false}
        onLayout={(e) => {
          press.onLayout(e);
          // Skydd: ett kort som hamnar på minsta bredden får ingen bredd av sin
          // förälder (t.ex. en rad som krymper till innehållet). Ge föräldern en bredd.
          if (__DEV__ && !isSmall && e.nativeEvent.layout.width <= productCard.minWidth) {
            console.warn(
              `[ProductCard] "${name}" är bara ${Math.round(e.nativeEvent.layout.width)} pt bred: föräldern saknar troligen bredd (fast bredd eller flex i en container med bredd).`,
            );
          }
        }}
        accessibilityRole="button"
        accessibilityLabel={`${brand} ${name}`}
        accessibilityHint={menu ? 'Håll in för fler val' : undefined}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={handlePress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={StyleSheet.flatten([
          styles.card,
          !isSmall && styles.cardMinWidth,
          featured && styles.cardFeatured,
          disabled && styles.disabled,
          containerStyle,
        ])}
      >
        <Animated.View style={press.scaleStyle}>
          {/* Spik (brief 18): bilden är källan för zoomen till Produktdetaljs hero. */}
          {navigates ? (
            <Transition.Boundary id={boundaryId} group={PRODUCT_BOUNDARY_GROUP}>
              {imageBlock}
            </Transition.Boundary>
          ) : (
            imageBlock
          )}

          {!isSmall && (
            <ProductCardText
              id={id}
              brand={brand}
              name={name}
              price={price}
              rating={rating}
              reviewCount={reviewCount}
              sustainabilityScore={sustainabilityScore}
              size={isLarge ? 'L' : 'M'}
              showSave={saveButton}
            />
          )}
        </Animated.View>
      </Pressable>
  );

  return (
    <GestureDetector gesture={longPress}>
      {card}
    </GestureDetector>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    flex: 1,
  },
  // Skydd mot kort utan bredd (dialogbuggen): aldrig smalare än productCard.minWidth.
  cardMinWidth: {
    minWidth: productCard.minWidth,
  },
  cardFeatured: {
    flex: 0,
    width: '100%',
  },
  hidden: {
    opacity: 0,
  },
  disabled: {
    opacity: motion.disabledOpacity,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.placeholder,
  },
  imageContainerSmall: {
    borderRadius: radius.tile,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: overlay.scrimSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.micro,
    color: overlay.onPhoto, // på foto: fast vit i båda teman
    letterSpacing: letterSpacing.wide,
  },
}));
