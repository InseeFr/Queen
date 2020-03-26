import React from 'react';
import PropTypes from 'prop-types';
import styles from './preloader.scss';
import imgPreloader from '../../img/preloader.svg';
import D from '../../i18n';

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
