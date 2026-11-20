import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon (bock, vald), brief 36.

type Props = {
  color: string;
  size?: number;
}

const CheckIcon = ({ color, size = 16 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
)

export default CheckIcon
