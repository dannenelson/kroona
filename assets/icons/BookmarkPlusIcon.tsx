import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon (bokmärke med plus: spara i samling), brief 36. Linje 1,7.

type Props = {
  color: string;
  size?: number;
}

const BookmarkPlusIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.7} strokeLinejoin="round" d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" />
    <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" d="M12 8v6M9 11h6" />
  </Svg>
)

export default BookmarkPlusIcon
