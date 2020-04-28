import React from 'react';

const Icon = ({ width = 48, color = '#000000', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    viewBox="0 0 24 24"
    fill={color}
    width={width}
    height={width}
  >
    <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export default Icon;
