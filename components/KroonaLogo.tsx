import { useTheme, homeHeader } from '../theme';
import KroonaLogoSvg from '../assets/logos/kroona.svg';

// Filens viewBox (1440 × 238). Ordbilden slutar vid ca x 1378; ™ ligger till
// höger om den (x ca 1399–1440).
const VIEW_HEIGHT = 238;
const VIEW_WIDTH = 1440;
const VIEW_WIDTH_NO_TM = 1378;

type Props = {
  /** Höjd i px; bredden räknas från proportionen. */
  height: number;
  /** Default: temats textfärg (`textPrimary`). */
  color?: string;
  /**
   * Visa ™. Default: från `homeHeader.logoTrademarkMinHeight` (40) och uppåt;
   * under det blir märket en oläslig prick. ™ ligger kvar i filen och döljs
   * genom att viewBox beskärs till ordbilden (brief 46).
   */
  trademark?: boolean;
};

/**
 * Kroona-logotypen (brief 45) från `assets/logos/kroona.svg`. Filen fylls med
 * `currentColor`, så färgen kommer från temat.
 */
export default function KroonaLogo({ height, color, trademark }: Props) {
  const { colors } = useTheme();
  const showTm = trademark ?? height >= homeHeader.logoTrademarkMinHeight;
  const viewWidth = showTm ? VIEW_WIDTH : VIEW_WIDTH_NO_TM;
  return (
    <KroonaLogoSvg
      width={(height * viewWidth) / VIEW_HEIGHT}
      height={height}
      viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`}
      color={color ?? colors.textPrimary}
      accessibilityRole="image"
      accessibilityLabel="Kroona"
    />
  );
}
