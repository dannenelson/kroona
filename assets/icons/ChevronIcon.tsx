import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon (chevron höger) från referensen "Kroona Looken A", linje 2.
// Ikonbiblioteket och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
  /** Linjetjocklek (standard 2; "Visa fler"-länken 2,2, brief 53). */
  strokeWidth?: number;
}

const ChevronIcon = ({ color, size = 16, strokeWidth = 2 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" d="M9.5 6l6 6-6 6" />
  </Svg>
)

export default ChevronIcon
