import type { ComponentType, ReactElement, ReactNode } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native';
import Transition from 'react-native-screen-transitions';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedViewClass from '@react-native-masked-view/masked-view';
import { useCardPress } from '../hooks/useCardPress';
import {
  makeStyles,
  typography,
  letterSpacing,
  fonts,
  radius,
  overlay,
  edgeBlur,
  editorialCard,
  spacing,
  logo as logoTokens,
} from '../theme';
import { LOGO_ASPECT, type LogoComponent } from '../data/logos';
import { softHyphenate } from '../lib/softHyphenate';

// Paketets klasstyper passar inte React 19:s JSX-typer (samma som i EdgeFade).
const MaskedView = MaskedViewClass as unknown as ComponentType<ViewProps & { maskElement: ReactElement }>;

export type EditorialVariant = 'portraitLarge' | 'portraitSmall' | 'landscape';

type Props = {
  variant: EditorialVariant;
  title: string;
  subtitle?: string;
  /** Liten rad ovanför titeln (bara liggande kort), t.ex. "Pågående dialog". */
  status?: string;
  imageUrl?: string;
  /** Ersätter bilden, t.ex. mosaik eller kollage. */
  cover?: ReactNode;
  /** Överst till vänster på bilden, t.ex. kuratorchip. */
  chip?: ReactNode;
  /** Härlett format (mix, kollage): annan storlek och radie, samma text som varianten. */
  size?: { width: number; height: number; radius: number };
  /** Textens justering; standard efter variant (stående centrerad, liggande vänster).
   *  Mixkorten är vänsterställda (brief 52). */
  align?: 'center' | 'start';
  /** Vit logotyp som ersätter titeln (brief 47); titeln blir tillgänglighetsetikett. */
  logo?: LogoComponent;
  /** Liten ikon före titeln, t.ex. förstoringsglas på idékort (brief 53). */
  titleIcon?: ReactNode;
  /** Samling/område utan logotyp: större titel som väger som en logotyp, och mer
   *  luft till undertiteln. Stort kort `display` 34/38 (700) med tät spärrning,
   *  litet kort `title2` 20/24. Max två rader, mjuka bindestreck (softHyphenate). */
  prominentTitle?: boolean;
  /** Zoomövergång (CollectionCard-mönstret): hela kortet är källan. */
  boundary?: { id: string; group: string };
  onPress?: () => void;
  accessibilityLabel?: string;
};

const VARIANTS = {
  portraitLarge: { ...editorialCard.portraitLarge, radius: radius.editorialLarge, small: false, blur: true, centered: true },
  portraitSmall: { ...editorialCard.portraitSmall, radius: radius.editorialSmall, small: true, blur: false, centered: true },
  landscape: { ...editorialCard.landscape, radius: radius.editorialMedium, small: false, blur: true, centered: false },
} as const;

/**
 * Redaktionellt kort (brief 43): text på bilden, med toning och (stor stående
 * och liggande) äkta blur i botten. Stående kort har centrerad text, liggande
 * vänsterställd. Radien skalar med storleken (24 / 20 / 16). En 1 px inre kant
 * ritas ovanpå bilden (aldrig dubbel kant). Produktkort använder inte detta:
 * där ligger texten under bilden.
 */
export default function EditorialCard({
  variant,
  title,
  subtitle,
  status,
  imageUrl,
  cover,
  chip,
  size,
  boundary,
  onPress,
  accessibilityLabel,
  logo: Logo,
  align,
  titleIcon,
  prominentTitle = false,
}: Props) {
  const styles = useStyles();
  const press = useCardPress();
  const base = VARIANTS[variant];
  const v = { ...base, centered: align ? align === 'center' : base.centered };
  const width = size?.width ?? v.width;
  const height = size?.height ?? v.height;
  const r = size?.radius ?? v.radius;
  const shape = { width, height, borderRadius: r };
  const bottomRadii = { borderBottomLeftRadius: r, borderBottomRightRadius: r };
  // Större titel: samma storlek på alla kort av samma typ, ingen skalning. Långa
  // sammansatta ord avstavas på sammansättningsgränsen (mjuka bindestreck).
  const shownTitle = prominentTitle ? softHyphenate(title) : title;

  const visual = (
    <View style={[styles.card, shape]}>
      {cover ?? (imageUrl ? <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null)}

      {/* Blur: fyra lager à 25 % (summa ca 12 px i botten) med förskjutna
          masker, så att blurren byggs upp gradvis uppifrån. BlurView
          klipps inte pålitligt av förälderns radie, så lagren har egna nedre hörn. */}
      {v.blur ? (
        <View pointerEvents="none" style={[styles.bottomZone, { height: height * editorialCard.blurShare }]}>
          {editorialCard.blurLayers.map((layer, i) => (
            <MaskedView
              key={i}
              style={[StyleSheet.absoluteFill, bottomRadii, styles.clip]}
              maskElement={
                <LinearGradient
                  colors={[edgeBlur.maskColors[2], edgeBlur.maskColors[0]]}
                  locations={[...layer.maskStops] as [number, number]}
                  style={StyleSheet.absoluteFill}
                />
              }
            >
              <BlurView
                tint="dark"
                intensity={editorialCard.blurPx * layer.strength * edgeBlur.intensityPerPx}
                style={[StyleSheet.absoluteFill, bottomRadii, styles.clip]}
              />
            </MaskedView>
          ))}
        </View>
      ) : null}

      <LinearGradient
        pointerEvents="none"
        colors={v.small ? overlay.editorialFade.colorsSmall : overlay.editorialFade.colors}
        locations={overlay.editorialFade.locations}
        style={[
          styles.bottomZone,
          { height: height * (v.small ? editorialCard.fadeShareSmall : editorialCard.fadeShare) },
        ]}
      />

      {chip ? <View style={[styles.chip, v.small && styles.chipSmall]}>{chip}</View> : null}

      <View
        style={[
          styles.text,
          v.small && styles.textSmall,
          v.centered && styles.textCentered,
          prominentTitle && !Logo && styles.textProminent,
        ]}
      >
        {status ? (
          <Text style={styles.status} numberOfLines={1}>
            {status}
          </Text>
        ) : null}
        {Logo ? (
          // Logotypen: ca 60 % (stor) / 75 % (liten) av kortets bredd, högst 36 hög.
          <Logo
            width={Math.min(width * (v.small ? logoTokens.smallShare : logoTokens.largeShare), logoTokens.maxHeight * LOGO_ASPECT)}
            height={Math.min((width * (v.small ? logoTokens.smallShare : logoTokens.largeShare)) / LOGO_ASPECT, logoTokens.maxHeight)}
            style={!v.centered && styles.logoStart}
          />
        ) : (
        <View style={[styles.titleRow, v.centered && styles.titleRowCentered]}>
          {titleIcon}
          <Text
            style={[
              prominentTitle
                ? v.small
                  ? styles.titleProminentSmall
                  : styles.titleProminent
                : variant === 'portraitLarge'
                  ? styles.titleLarge
                  : variant === 'landscape'
                    ? styles.titleMedium
                    : styles.titleSmall,
              v.centered && styles.centered,
              styles.titleShrink,
            ]}
            numberOfLines={2}
          >
            {shownTitle}
          </Text>
        </View>
        )}
        {subtitle ? (
          <Text style={[v.small ? styles.subtitleSmall : styles.subtitle, v.centered && styles.centered]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Inre kantlinje ovanpå bilden. */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.edge, { borderRadius: r }]} />
    </View>
  );

  return (
    <Pressable
      disabled={!onPress}
      onLayout={press.onLayout}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel ?? [status, title, subtitle].filter(Boolean).join(', ')}
    >
      <Animated.View style={press.scaleStyle}>
        {boundary ? (
          <Transition.Boundary id={boundary.id} group={boundary.group}>
            {visual}
          </Transition.Boundary>
        ) : (
          visual
        )}
      </Animated.View>
    </Pressable>
  );
}

const onPhotoText = { color: overlay.onPhoto };

const useStyles = makeStyles((t) => ({
  card: {
    overflow: 'hidden',
    borderCurve: 'continuous',
    backgroundColor: t.colors.placeholder,
  },
  clip: {
    overflow: 'hidden',
  },
  bottomZone: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  edge: {
    borderWidth: 1,
    borderColor: t.colors.imageEdge,
    borderCurve: 'continuous',
  },
  chip: {
    position: 'absolute',
    top: editorialCard.padding,
    left: editorialCard.padding,
    right: editorialCard.padding,
    alignItems: 'flex-start',
  },
  chipSmall: {
    top: editorialCard.paddingSmall,
    left: editorialCard.paddingSmall,
    right: editorialCard.paddingSmall,
  },
  text: {
    position: 'absolute',
    left: editorialCard.padding,
    right: editorialCard.padding,
    bottom: editorialCard.padding,
    gap: 2, // lokal optisk luft: titel → undertitel
  },
  // Samling utan logotyp: titel och undertitel hänger inte ihop (brief 63).
  textProminent: {
    gap: spacing.sm,
  },
  textSmall: {
    left: editorialCard.paddingSmall,
    right: editorialCard.paddingSmall,
    bottom: editorialCard.paddingSmall,
  },
  textCentered: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // lokal optisk luft: ikon → titel (brief 53)
  },
  titleRowCentered: {
    justifyContent: 'center',
  },
  titleShrink: {
    flexShrink: 1,
  },
  centered: {
    textAlign: 'center',
  },
  logoStart: {
    alignSelf: 'flex-start',
  },
  status: {
    ...typography.caption,
    fontFamily: fonts.ui500,
    color: overlay.onPhotoMuted,
  },
  titleLarge: {
    ...typography.editorialLarge,
    ...onPhotoText,
  },
  titleMedium: {
    ...typography.editorialMedium,
    ...onPhotoText,
  },
  titleSmall: {
    ...typography.editorialSmall,
    ...onPhotoText,
  },
  // Stora kort: tydligt mer uttrycksfull än små, `display` 34/38 (700), tät spärrning.
  titleProminent: {
    ...typography.display,
    letterSpacing: letterSpacing.tight,
    ...onPhotoText,
  },
  titleProminentSmall: {
    ...typography.title2,
    ...onPhotoText,
  },
  subtitle: {
    ...typography.label,
    fontFamily: fonts.ui400,
    color: overlay.onPhotoMuted,
  },
  subtitleSmall: {
    ...typography.caption,
    color: overlay.onPhotoMuted,
  },
}));
