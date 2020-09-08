import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ width, color, ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    width={width}
    height={width}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);
Icon.defaultProps = {
  width: 28,
  color: '#FFFFFF',
};

Icon.propTypes = {
  width: PropTypes.number,
  color: PropTypes.string,
};

export default React.memo(Icon);
