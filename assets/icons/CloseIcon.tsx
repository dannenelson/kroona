import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon (stäng/kryss), linje 1,7 som referensens ikoner.
// Ikonbiblioteket och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const CloseIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </Svg>
)

export default CloseIcon
