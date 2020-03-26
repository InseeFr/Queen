import React from 'react';
import D from 'i18n';
import styles from './not-found.scss';

export default () => (
  <>
    <style type="text/css">{styles}</style>
    <div className="not-found">
      <div className="content">
        <h1>{D.pageNotFound}</h1>
        <h2>{D.pageNotFoundHelp}</h2>
      </div>
    </div>
  </>
);
