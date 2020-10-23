import React, { useState } from 'react';
import D from 'i18n';
import { QUESTIONNAIRE_EXAMPLE_URL } from 'utils/constants';
import { useHistory } from 'react-router-dom';
import { version } from '../../../../package.json';

const QuestionnaireForm = () => {
  const [value, setValue] = useState('');
  const history = useHistory();

  const goToQuestionnaire = e => {
    history.push({
      pathname: '/queen/visualize',
      search: `?questionnaire=${encodeURIComponent(value || QUESTIONNAIRE_EXAMPLE_URL)}`,
    });
    e.preventDefault();
  };

  return (
    <>
      <div className="visualize-content">
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
  );
};

export default QuestionnaireForm;
