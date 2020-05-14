import React from 'react';
import D from 'i18n';
import styles from './error.scss';
import { version } from '../../../../package.json';

const Error = ({ message = '' }) => (
  <>
    <style type="text/css">{styles}</style>
    <div className="error">
      <h2>{D.errorOccurred}</h2>
      <h3>{message}</h3>
    </div>
    <div className="version">{`Version ${version}`}</div>
  </>
);

export default Error;
