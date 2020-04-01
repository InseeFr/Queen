import React from 'react';

const Icon = ({ width = 121, color = '#000000', ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width={width}
    viewBox="-0.5 -0.5 121 111"
  >
    <defs />
    <g>
      <path
        d="M 15 45 L 15 15 Q 15 5 25 5 L 105 5 Q 115 5 115 15 L 115 95 Q 115 105 105 105 L 25 105 Q 15 105 15 95 L 15 65"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeMiterlimit="10"
        pointerEvents="stroke"
      />
      <path
        d="M 5 55 L 85 55"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeMiterlimit="10"
        pointerEvents="stroke"
      />
      <path
        d="M 55 25 L 85 55 L 55 85"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeMiterlimit="10"
        pointerEvents="stroke"
      />
    </g>
  </svg>
);

export default Icon;
