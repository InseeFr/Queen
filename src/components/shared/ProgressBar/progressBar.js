import React from 'react';
import PropTypes from 'prop-types';
import { StyleWrapper } from './progressBar.style';

const ProgressBar = ({ value }) => {
  return (
    <StyleWrapper progress={value} className="progress">
      <div
        role="progressbar"
        className="progress-bar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span>{`${value} %`}</span>
      </div>
    </StyleWrapper>
  );
};

ProgressBar.defaultProps = {
  value: 0,
};

ProgressBar.propTypes = {
  value: PropTypes.number,
};

export default ProgressBar;
