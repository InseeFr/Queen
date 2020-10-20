import React from 'react';
import D from 'i18n';
import { QUEEN_URL } from 'utils/constants';
import { StyleWrapper } from './not-found.style';
import { version } from '../../../../package.json';
import { Link } from 'react-router-dom';

export default () => {
  const questionnaireExampleUrl = encodeURIComponent(
    `${QUEEN_URL}/static/questionnaire/simpsons.json`
  );
  return (
    <StyleWrapper>
      <div className="content">
        <h1>{D.pageNotFound}</h1>
        <h2>{D.pageNotFoundHelp}</h2>

        <Link to={`/queen/visualize?questionnaire=${questionnaireExampleUrl}`}>
          {D.seeQuestionnaireExample}
        </Link>
      </div>
      <div className="version">{`Version ${version}`}</div>
    </StyleWrapper>
  );
};
