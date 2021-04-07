import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'components/app';
import Orchestrator from 'components/orchestrator';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import { useRemoteData, useVisuQuery } from 'utils/hook';
import QuestionnaireForm from './questionnaireForm';
import { useHistory } from 'react-router';

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
  const history = useHistory();

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
      setSource(questionnaire);
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
          preferences={['PREVIOUS', 'COLLECTED']}
          features={['VTL']}
          pagination={true}
          filterDescription={false}
          save={unit => surveyUnitIdbService.addOrUpdateSU(unit)}
          close={() => history.push('/')}
        />
      )}
      {!questionnaireUrl && <QuestionnaireForm />}
    </>
  );
};

export default Visualizer;
