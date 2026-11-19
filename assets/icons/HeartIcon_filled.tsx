import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk fylld variant av HeartIcon (samma form, fylld + samma linje),
// för vald-läge i IconButton. Ikonbiblioteket är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const HeartIconFilled = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path fill={color} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" d="M12 19.75c-.3 0-.6-.1-.84-.28C8.3 17.3 4.25 14.03 4.25 9.9 4.25 7.45 6.15 5.5 8.5 5.5c1.4 0 2.67.7 3.5 1.83A4.28 4.28 0 0 1 15.5 5.5c2.35 0 4.25 1.95 4.25 4.4 0 4.13-4.05 7.4-6.91 9.57-.24.18-.54.28-.84.28Z" />
  </Svg>
)

export default HeartIconFilled
