import * as React from "react"
import Svg, { Path } from "react-native-svg"

// Provisorisk ikon: ikonbiblioteket och ikonvikten är öppen fråga 3 i docs/design.md.

type Props = {
  color: string;
  size?: number;
}

const NewChatIcon = ({ color, size = 24 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V12" />
    <Path stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M17.5 3.5l3 3-8 8H9.5v-3z" />
  </Svg>
)

export default NewChatIcon
