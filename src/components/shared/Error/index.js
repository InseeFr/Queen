import React from 'react';
import D from 'i18n';
import styles from './error.scss';

const Error = ({ message = '' }) => (
  <>
    <style type="text/css">{styles}</style>
    <div className="error">
      <h2>{D.errorOccurred}</h2>
      <h3>{message}</h3>
    </div>
  </>
);

export default Error;
