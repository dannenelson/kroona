import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon: ikonbiblioteket och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const LeafIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M5 19C5 11 10 6 19.5 4.5 19 14 14 19 5 19z" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M5 19l7-7" />
  </Svg>
)

export default LeafIcon
