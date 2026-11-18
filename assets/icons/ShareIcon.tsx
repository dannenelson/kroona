import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon från referensen "Kroona Looken A" (linje 1,7). Ikonbiblioteket
// och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const ShareIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v11M8.25 7.5 12 3.75l3.75 3.75M7 11h-.5a1.75 1.75 0 0 0-1.75 1.75v5.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-5.5A1.75 1.75 0 0 0 17.5 11H17" />
  </Svg>
)

export default ShareIcon
