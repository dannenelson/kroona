import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon från referensen "Kroona Looken A" (linje 1,7). Ikonbiblioteket
// och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const SimilarIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" d="M6.5 4h6A2.5 2.5 0 0 1 15 6.5v6a2.5 2.5 0 0 1-2.5 2.5h-6A2.5 2.5 0 0 1 4 12.5v-6A2.5 2.5 0 0 1 6.5 4ZM18 9.25a2.5 2.5 0 0 1 2 2.45v6.05a2.5 2.5 0 0 1-2.5 2.5h-6.05A2.5 2.5 0 0 1 9 18.25" />
  </Svg>
)

export default SimilarIcon
