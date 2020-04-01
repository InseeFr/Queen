import React from 'react';
import imgPreloader from 'img/preloader.svg';
import D from 'i18n';
import styles from './preloader.scss';

const Preloader = ({ message = '' }) => (
  <>
    <style type="text/css">{styles}</style>
    <div className="preloader">
      <img src={imgPreloader} alt="waiting..." />
      <h2>{D.pleaseWait}</h2>
      <h3>{message}</h3>
    </div>
  </>
);

export default Preloader;
