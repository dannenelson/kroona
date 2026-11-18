import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon: ikonbiblioteket och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const BackIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
  </Svg>
)

export default BackIcon
