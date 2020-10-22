import React from 'react';
import D from 'i18n';
import { Link } from 'react-router-dom';
import { StyleWrapper } from './not-found.style';
import { version } from '../../../../package.json';

export default () => {
  return (
    <StyleWrapper>
      <div className="content">
        <h1>{D.pageNotFound}</h1>
        <h2>{D.pageNotFoundHelp}</h2>

        <Link to="/queen/visualize">{D.goToVisualizePage}</Link>
      </div>
      <div className="version">{`Version ${version}`}</div>
    </StyleWrapper>
  );
};
