import * as React from "react"
import Svg, { Path } from "react-native-svg"

type Props = {
  color: string;
  size?: number;
}

const FindIcon = ({ color, size = 24 }: Props) => (
  <Svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  >
    <Path
      fill={color}
      d="M16.25 11a5.25 5.25 0 1 0-10.5 0 5.25 5.25 0 0 0 10.5 0Zm1.5 0a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0ZM16.47 16.47a.75.75 0 0 1 1.06 0l3 3a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06Z"
    />
  </Svg>
)

export default FindIcon