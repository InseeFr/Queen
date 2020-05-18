import React from 'react';
import D from 'i18n';
import { StyleWrapper } from './error.style';
import { version } from '../../../../package.json';

const Error = ({ message = '' }) => (
  <StyleWrapper>
    <div className="error">
      <h2>{D.errorOccurred}</h2>
      <h3>{message}</h3>
    </div>
    <div className="version">{`Version ${version}`}</div>
  </StyleWrapper>
);

export default Error;
