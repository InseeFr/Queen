import React from 'react';
import D from 'i18n';
import { StyleWrapper } from './not-found.style';
import { version } from '../../../../package.json';
import { synchronize } from 'utils/synchronize';

export default () => (
  <StyleWrapper>
    <div className="content">
      <h1>{D.pageNotFound}</h1>
      <h2>{D.pageNotFoundHelp}</h2>
      <button onClick={synchronize}>synchronize</button>
    </div>
    <div className="version">{`Version ${version}`}</div>
  </StyleWrapper>
);
