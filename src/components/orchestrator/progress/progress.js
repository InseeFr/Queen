import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from '@inseefr/lunatic';

const Progress = ({ nbModules, page }) => (
  <div id="survey-progress" className="progress">
    <ProgressBar id="progress-bar" value={(page / nbModules) * 100} />
  </div>
);

Progress.propTypes = {
  nbModules: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default Progress;
