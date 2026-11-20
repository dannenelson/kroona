import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon (plus/ny), linje 1,7 som övriga ikoner (brief 33).
// Ikonbiblioteket och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const PlusIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" d="M12 5v14M5 12h14" />
  </Svg>
)

export default PlusIcon
