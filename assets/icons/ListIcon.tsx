import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

// Provisorisk ikon (vy: rader), brief 35. Linje 1,7 som övriga ikoner.

type Props = {
  color: string;
  size?: number;
}

const ListIcon = ({ color, size = 18 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path stroke={color} strokeWidth={1.7} strokeLinecap="round" d="M9 7h11M9 12h11M9 17h11" />
    <Circle cx={4.8} cy={7} r={0.9} stroke={color} strokeWidth={1.7} />
    <Circle cx={4.8} cy={12} r={0.9} stroke={color} strokeWidth={1.7} />
    <Circle cx={4.8} cy={17} r={0.9} stroke={color} strokeWidth={1.7} />
  </Svg>
)

export default ListIcon
