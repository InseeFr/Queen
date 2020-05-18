import React from 'react';
import imgPreloader from 'img/preloader.svg';
import D from 'i18n';
import { version } from '../../../../package.json';
import { StyleWrapper } from './preloader.style';

const Preloader = ({ message = '' }) => (
  <StyleWrapper>
    <div className="preloader">
      <img src={imgPreloader} alt="waiting..." />
      <h2>{D.pleaseWait}</h2>
      <h3>{message}</h3>
    </div>
    <div className="version">{`Version ${version}`}</div>
  </StyleWrapper>
);

export default Preloader;
