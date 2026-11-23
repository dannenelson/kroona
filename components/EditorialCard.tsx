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
  fonts,
  radius,
  overlay,
  edgeBlur,
  editorialCard,
} from '../theme';

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
}: Props) {
  const styles = useStyles();
  const press = useCardPress();
  const v = VARIANTS[variant];
  const width = size?.width ?? v.width;
  const height = size?.height ?? v.height;
  const r = size?.radius ?? v.radius;
  const shape = { width, height, borderRadius: r };
  const bottomRadii = { borderBottomLeftRadius: r, borderBottomRightRadius: r };

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

      <View style={[styles.text, v.small && styles.textSmall, v.centered && styles.textCentered]}>
        {status ? (
          <Text style={styles.status} numberOfLines={1}>
            {status}
          </Text>
        ) : null}
        <Text
          style={[
            variant === 'portraitLarge' ? styles.titleLarge : variant === 'landscape' ? styles.titleMedium : styles.titleSmall,
            v.centered && styles.centered,
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
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
  textSmall: {
    left: editorialCard.paddingSmall,
    right: editorialCard.paddingSmall,
    bottom: editorialCard.paddingSmall,
  },
  textCentered: {
    alignItems: 'center',
  },
  centered: {
    textAlign: 'center',
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
