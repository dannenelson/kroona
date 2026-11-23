import { useTheme } from '../theme';
import KroonaLogoSvg from '../assets/logos/kroona.svg';

// Logotypens proportion, från filens viewBox (1440 × 238).
const ASPECT = 1440 / 238;

type Props = {
  /** Höjd i px; bredden räknas från proportionen. */
  height: number;
  /** Default: temats textfärg (`textPrimary`). */
  color?: string;
};

/**
 * Kroona-logotypen (brief 45) från `assets/logos/kroona.svg`. Filen fylls med
 * `currentColor`, så färgen kommer från temat. ™-märket ingår i filen och blir
 * oläsligt vid liten höjd (ca 20 px).
 */
export default function KroonaLogo({ height, color }: Props) {
  const { colors } = useTheme();
  return (
    <KroonaLogoSvg
      width={height * ASPECT}
      height={height}
      color={color ?? colors.textPrimary}
      accessibilityRole="image"
      accessibilityLabel="Kroona"
    />
  );
}
