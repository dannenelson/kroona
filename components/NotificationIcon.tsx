import { iconSize } from '../theme';
import Icon from './Icon';

type Props = {
  /** Default: temats textfärg. */
  color?: string;
  size?: number;
  /** Olästa notiser: klockan med prick (`notification-filled`, pricken i samma färg). */
  unread?: boolean;
};

/** Notisikon (brief 45, 57, 64): `notification` i ikonsystemet, linje 1,5 i alla storlekar; prick vid olästa. */
export default function NotificationIcon({ color, size = iconSize.lg, unread = false }: Props) {
  return <Icon name="notification" size={size} color={color} filled={unread} />;
}
