import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ width, color, back, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    viewBox="0 0 24 24"
    fill={color}
    width={width}
    height={width}
  >
    {!back && (
      <>
        <path d="M10 17l5-5-5-5v10z" />
        <path d="M0 24V0h24v24H0z" fill="none" />
      </>
    )}
    {back && (
      <>
        <path d="M14 7l-5 5 5 5V7z" />
        <path d="M24 0v24H0V0h24z" fill="none" />
      </>
    )}
  </svg>
);

Icon.defaultProps = {
  width: 36,
  color: '#000000',
  back: false,
};

Icon.propTypes = {
  width: PropTypes.number,
  color: PropTypes.string,
  back: PropTypes.bool,
};

export default React.memo(Icon);
