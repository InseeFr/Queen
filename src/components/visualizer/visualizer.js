import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import OrchestratorManager from 'components/orchestratorManager';
import { QUESTIONNAIRE_EXAMPLE_URL } from 'utils/constants';
import { useHistory } from 'react-router-dom';
import { version } from '../../../package.json';
import { StyleWrapper } from './visualizer.style';

const Visualizer = ({ location, ...other }) => {
  const [questionnaireUrl, setQuestionnaireUrl] = useState(null);
  const [value, setValue] = useState('');
  const history = useHistory();

  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search);
    setQuestionnaireUrl(urlSearch.get('questionnaire') || null);
  }, [location.search]);

  const goToQuestionnaire = event => {
    history.push({
      pathname: '/queen/visualize',
      search: `?questionnaire=${encodeURIComponent(value || QUESTIONNAIRE_EXAMPLE_URL)}`,
    });
    event.preventDefault();
  };

  return (
    <StyleWrapper>
      {questionnaireUrl && <OrchestratorManager {...other} visualize={questionnaireUrl} />}
      {!questionnaireUrl && (
        <>
          <div className="content">
            <h1 className="title">{D.visualizationTitlePage}</h1>
            <form onSubmit={goToQuestionnaire}>
              <label htmlFor="input-questionnaire" id="label-input-questionnaire">
                {`${D.questionnaireUrl} :`}
              </label>
              <input
                id="input-questionnaire"
                type="input"
                value={value}
                placeholder={QUESTIONNAIRE_EXAMPLE_URL}
                onChange={({ target: { value: v } }) => {
                  setValue(v);
                }}
                className="input-questionnaire"
              />

              <input type="submit" className="button-questionnaire" value={D.visualize} />
            </form>
          </div>
          <div className="version">{`Version ${version}`}</div>
        </>
      )}
    </StyleWrapper>
  );
};

Visualizer.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default Visualizer;
