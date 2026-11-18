import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon: ikonbiblioteket och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const ArchiveIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5h15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M5 8.5v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-10M10 12.5h4" />
  </Svg>
)

export default ArchiveIcon
