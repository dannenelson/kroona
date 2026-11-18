import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon från referensen "Kroona Looken A" (linje 1,7). Ikonbiblioteket
// och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const FollowIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a8.25 8.25 0 1 1 0 16.5 8.25 8.25 0 0 1 0-16.5ZM12 8.5v7M8.5 12h7" />
  </Svg>
)

export default FollowIcon
