import React from 'react';
import D from 'i18n';
import { StyleWrapper } from './not-found.style';

export default () => (
  <StyleWrapper>
    <div className="content">
      <h1>{D.pageNotFound}</h1>
      <h2>{D.pageNotFoundHelp}</h2>
    </div>
  </StyleWrapper>
);
