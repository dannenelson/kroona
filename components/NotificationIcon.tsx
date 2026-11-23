import { iconSize, useTheme } from '../theme';
import BellSvg from '../assets/svg/icons/bell.svg';

type Props = {
  /** Default: temats textfärg. */
  color?: string;
  size?: number;
};

/** Notisikon (brief 45): `assets/svg/icons/bell.svg`, linjeikon 1,5 i `currentColor` (ritad om från 1,8 i brief 46, som övriga ikoner). */
export default function NotificationIcon({ color, size = iconSize.lg }: Props) {
  const { colors } = useTheme();
  return <BellSvg width={size} height={size} color={color ?? colors.textPrimary} />;
}
