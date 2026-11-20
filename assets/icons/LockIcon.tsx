import * as React from "react"
import Svg, { Path, Rect } from "react-native-svg"

// Provisorisk ikon (lås, privat samling), brief 35. Linje som övriga ikoner.

type Props = {
  color: string;
  size?: number;
}

const LockIcon = ({ color, size = 12 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={6} y={11} width={12} height={9} rx={2} stroke={color} strokeWidth={2} />
    <Path stroke={color} strokeWidth={2} strokeLinecap="round" d="M9 11V8a3 3 0 0 1 6 0v3" />
  </Svg>
)

export default LockIcon
