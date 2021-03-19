/* eslint-disable no-alert */
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'components/app';
import D from 'i18n';
import Orchestrator from 'components/orchestrator';
import * as UQ from 'utils/questionnaire';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import { useRemoteData, useVisuQuery } from 'utils/hook';
import QuestionnaireForm from './questionnaireForm';

const Visualizer = () => {
  const configuration = useContext(AppContext);

  const [surveyUnit, setSurveyUnit] = useState(undefined);
  const [source, setSource] = useState(null);

  const [waiting, setWaiting] = useState(false);

  const { questionnaireUrl, dataUrl } = useVisuQuery();
  const { surveyUnit: suData, questionnaire, loadingMessage, errorMessage } = useRemoteData(
    questionnaireUrl,
    dataUrl
  );

  const createFakeSurveyUnit = surveyUnit => {
    const unit = {
      ...surveyUnit,
      id: '1234',
    };
    surveyUnitIdbService.addOrUpdateSU(unit);
    return unit;
  };

  useEffect(() => {
    if (questionnaireUrl && questionnaire && suData) {
      setSource({
        ...questionnaire,
        components: UQ.buildQueenQuestionnaire(questionnaire.components),
      });
      setSurveyUnit(createFakeSurveyUnit(suData));
      setWaiting(false);
    }
  }, [questionnaireUrl, questionnaire, suData]);

  return (
    <>
      {loadingMessage && <Preloader message={loadingMessage} />}
      {errorMessage && <Error message={errorMessage} />}
      {!waiting && questionnaireUrl && source && surveyUnit && (
        <Orchestrator
          surveyUnit={surveyUnit}
          source={source}
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
    </>
  );
};

export default Visualizer;
