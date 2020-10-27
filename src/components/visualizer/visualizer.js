import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import Orchestrator from 'components/orchestrator';
import * as UQ from 'utils/questionnaire';
import { initialize } from 'utils/initializeVisualizer';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import { StyleWrapper } from './visualizer.style';
import QuestionnaireForm from './questionnaireForm';

const Visualizer = ({ location, ...other }) => {
  const { configuration } = other;

  const [questionnaireUrl, setQuestionnaireUrl] = useState(() => {
    const urlSearch = new URLSearchParams(location.search);
    return urlSearch.get('questionnaire') || null;
  });
  const [questionnaire, setQuestionnaire] = useState(null);

  const [surveyUnit, setSurveyUnit] = useState(undefined);
  const [error, setError] = useState(false);

  const [waiting, setWaiting] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search);
    const url = urlSearch.get('questionnaire') || null;
    if (!url) {
      setError(null);
      setWaiting(false);
      setQuestionnaire(null);
      setSurveyUnit(null);
    }
    if (questionnaireUrl !== url) setQuestionnaireUrl(url);
  }, [location.search, questionnaireUrl]);

  useEffect(() => {
    if (questionnaireUrl && !questionnaire) {
      setWaiting(true);
      const initOrchestrator = async () => {
        try {
          const initialization = initialize({
            questionnaireUrl,
            configuration,
            setWaitingMessage,
            setQuestionnaire,
          });
          await initialization();
        } catch (e) {
          setError(true);
          setErrorMessage(e.message);
          setWaiting(false);
        }
      };
      initOrchestrator();
    }
  }, [questionnaire, questionnaireUrl, configuration]);

  const createFakeSurveyUnit = () => {
    const unit = {
      id: '1234',
      data: {},
      comment: {},
    };
    surveyUnitIdbService.addOrUpdateSU(unit);
    return unit;
  };

  useEffect(() => {
    if (questionnaireUrl && questionnaire && !surveyUnit) {
      setQuestionnaire({
        ...questionnaire,
        components: UQ.buildQueenQuestionnaire(questionnaire.components),
      });
      setSurveyUnit(createFakeSurveyUnit());
      setWaiting(false);
    }
  }, [questionnaireUrl, questionnaire, surveyUnit]);

  return (
    <StyleWrapper>
      {waiting && <Preloader message={waitingMessage} />}
      {error && <Error message={errorMessage} />}
      {!waiting && questionnaireUrl && questionnaire && surveyUnit && (
        <Orchestrator
          surveyUnit={surveyUnit}
          source={questionnaire}
          dataSU={UQ.buildSpecialQueenData({})}
          standalone={configuration.standalone}
          readonly={false}
          savingType="COLLECTED"
          preferences={['COLLECTED']}
          features={['VTL']}
          filterDescription={false}
          save={unit => surveyUnitIdbService.addOrUpdateSU(unit)}
          close={() => alert(D.closeWindow)}
        />
      )}
      {!questionnaireUrl && <QuestionnaireForm />}
    </StyleWrapper>
  );
};

Visualizer.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default Visualizer;
