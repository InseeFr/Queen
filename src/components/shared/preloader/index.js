import React from 'react';
import PropTypes from 'prop-types';
import imgPreloader from 'img/preloader.svg';
import D from 'i18n';
import { version } from '../../../../package.json';
import { StyleWrapper } from './preloader.style';

const Preloader = ({ title, message }) => (
  <StyleWrapper>
    <div className="preloader">
      <img src={imgPreloader} alt="waiting..." />
      <h2>{title}</h2>
      <h3>{message}</h3>
    </div>
    <div className="version">{`Version ${version}`}</div>
  </StyleWrapper>
);

Preloader.defaultProps = {
  title: D.pleaseWait,
  message: '',
};

Preloader.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default Preloader;
