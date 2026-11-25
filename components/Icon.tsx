import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme, iconSize, icon } from '../theme';
import { iconRegistry, type IconName } from './iconRegistry';

export type { IconName };

type Props = {
  /** Filnamnet i assets/svg/icons utan .svg. */
  name: IconName;
  /** Rutan i px. Standard `iconSize.lg` (24). */
  size?: number;
  /** Standard temats `textPrimary`. */
  color?: string;
  /** Fylld variant: `<namn>-filled.svg` om den finns, annars fylls formerna med kod (linjen ligger kvar). */
  filled?: boolean;
  /** SYNLIG linje i px. Standard `icon.stroke` (1,5), oavsett storlek. */
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Ikonsystemet (brief 57, designsystem.md §17). Alla ikoner är ritade på 24-ruta
 * med `currentColor`. Filernas egna `stroke-width` tas bort i `.svgrrc` (svgo
 * removeAttrs), så linjen sätts här på roten och ärvs av formerna: ritad linje
 * = synlig linje × 24 / storlek, så att den ser lika tjock ut i 16, 24 och 28.
 * Dekorativ: döljs för skärmläsare; etiketten ligger på knappen eller raden.
 */
export default function Icon({ name, size = iconSize.lg, color, filled = false, strokeWidth, style }: Props) {
  const { colors } = useTheme();
  const c = color ?? colors.textPrimary;
  const filledName = `${name}-filled`;
  const ownFilled = filled && filledName in iconRegistry ? iconRegistry[filledName as IconName] : undefined;
  const Svg = ownFilled ?? iconRegistry[name];
  const drawn = ((strokeWidth ?? icon.stroke) * icon.grid) / size;

  return (
    <Svg
      width={size}
      height={size}
      color={c}
      strokeWidth={drawn}
      // Kodfyllning: roten får fyllning, formerna utan egen fill ärver den.
      {...(filled && !ownFilled ? { fill: c } : null)}
      style={style}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}
