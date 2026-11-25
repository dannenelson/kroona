import { iconSize } from '../theme';
import Icon from './Icon';

type Props = {
  /** Default: temats textfärg. */
  color?: string;
  size?: number;
};

/** Notisikon (brief 45, 57): `notification` i ikonsystemet, linje 1,5 i alla storlekar. */
export default function NotificationIcon({ color, size = iconSize.lg }: Props) {
  return <Icon name="notification" size={size} color={color} />;
}
