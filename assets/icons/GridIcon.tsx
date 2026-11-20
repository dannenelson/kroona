import * as React from "react"
import Svg, { Rect } from "react-native-svg"

// Provisorisk ikon (vy: kort), brief 35. Linje 1,7 som övriga ikoner.

type Props = {
  color: string;
  size?: number;
}

const GridIcon = ({ color, size = 18 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={4} y={4} width={6.5} height={6.5} rx={1.5} stroke={color} strokeWidth={1.7} />
    <Rect x={13.5} y={4} width={6.5} height={6.5} rx={1.5} stroke={color} strokeWidth={1.7} />
    <Rect x={4} y={13.5} width={6.5} height={6.5} rx={1.5} stroke={color} strokeWidth={1.7} />
    <Rect x={13.5} y={13.5} width={6.5} height={6.5} rx={1.5} stroke={color} strokeWidth={1.7} />
  </Svg>
)

export default GridIcon
