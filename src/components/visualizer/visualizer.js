import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'components/app';
import Orchestrator from 'components/orchestrator';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import { useRemoteData, useVisuQuery } from 'utils/hook';
import QuestionnaireForm from './questionnaireForm';
import { useHistory } from 'react-router';
import { checkQuestionnaire, downloadDataAsJson } from 'utils/questionnaire';
import { buildSuggesterFromNomenclatures } from 'utils/questionnaire/nomenclatures';

const Visualizer = () => {
  const { apiUrl, standalone } = useContext(AppContext);

  const [surveyUnit, setSurveyUnit] = useState(undefined);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  const { questionnaireUrl, dataUrl, readonly } = useVisuQuery();
  const {
    surveyUnit: suData,
    questionnaire,
    nomenclatures,
    loadingMessage,
    errorMessage,
  } = useRemoteData(questionnaireUrl, dataUrl);

  const [suggesters, setSuggesters] = useState(null);
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
    if (questionnaireUrl && questionnaire && suData && nomenclatures) {
      const { valid, error: questionnaireError } = checkQuestionnaire(questionnaire);
      if (valid) {
        setSource(questionnaire);
        const suggestersBuilt = buildSuggesterFromNomenclatures(apiUrl)(nomenclatures);
        setSuggesters(suggestersBuilt);
        setSurveyUnit(createFakeSurveyUnit(suData));
      } else {
        setError(questionnaireError);
      }
    }
  }, [questionnaireUrl, questionnaire, suData, apiUrl, nomenclatures]);

  useEffect(() => {
    if (errorMessage) setError(errorMessage);
  }, [errorMessage]);

  const closeAndDownloadData = async () => {
    const data = await surveyUnitIdbService.get('1234');
    downloadDataAsJson(data, 'data');
    history.push('/');
  };

  return (
    <>
      {loadingMessage && <Preloader message={loadingMessage} />}
      {error && <Error message={error} />}
      {questionnaireUrl && source && surveyUnit && suggesters && (
        <Orchestrator
          surveyUnit={surveyUnit}
          source={source}
          suggesters={suggesters}
          standalone={standalone}
          readonly={readonly}
          savingType="COLLECTED"
          preferences={['COLLECTED']}
          features={['VTL']}
          pagination={true}
          missing={true}
          filterDescription={false}
          save={unit => surveyUnitIdbService.addOrUpdateSU(unit)}
          close={closeAndDownloadData}
        />
      )}
      {!questionnaireUrl && <QuestionnaireForm />}
    </>
  );
};

export default Visualizer;
