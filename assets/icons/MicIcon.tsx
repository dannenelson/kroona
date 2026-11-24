import * as React from "react"
import Svg, { Path, Rect } from "react-native-svg"

// Provisorisk ikon (mikrofon), brief 53. Bara ikon i Fas 0: röst byggs inte.
// Ikonbiblioteket och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const MicIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={9} y={3.5} width={6} height={11} rx={3} stroke={color} strokeWidth={1.7} />
    <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" d="M6 11.5a6 6 0 0 0 12 0M12 17.5V20.5" />
  </Svg>
)

export default MicIcon
