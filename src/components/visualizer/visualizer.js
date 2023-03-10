import React, { useCallback, useContext, useEffect, useState } from 'react';
import { checkQuestionnaire, downloadDataAsJson } from 'utils/questionnaire';
import { useRemoteData, useVisuQuery } from 'utils/hook';

import { AppContext } from 'components/app';
import Error from 'components/shared/Error';
import LightOrchestrator from 'components/lightOrchestrator';
import Preloader from 'components/shared/preloader';
import QuestionnaireForm from './questionnaireForm';
import { buildSuggesterFromNomenclatures } from 'utils/questionnaire/nomenclatures';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { useHistory } from 'react-router';

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

  useEffect(() => {
    if (suData === null) return;
    const unit = {
      ...suData,
      id: '1234',
    };
    const insertSuInIndexedDB = async su => {
      console.log('Initiating sudata in IDB', su);
      await surveyUnitIdbService.addOrUpdateSU(su);
    };
    insertSuInIndexedDB(unit);
    setSurveyUnit(unit);
  }, [suData]);

  useEffect(() => {
    if (questionnaireUrl && questionnaire && suData && nomenclatures) {
      const { valid, error: questionnaireError } = checkQuestionnaire(questionnaire);
      if (valid) {
        setSource(questionnaire);
        const suggestersBuilt = buildSuggesterFromNomenclatures(apiUrl)(nomenclatures);
        setSuggesters(suggestersBuilt);
      } else {
        setError(questionnaireError);
      }
    }
  }, [questionnaireUrl, questionnaire, suData, apiUrl, nomenclatures]);

  useEffect(() => {
    if (errorMessage) setError(errorMessage);
  }, [errorMessage]);

  // const save = useCallback(async (unit, newData) => {
  //   console.log(unit, newData);
  //   await surveyUnitIdbService.addOrUpdateSU({
  //     ...unit,
  //     data: newData,
  //   });
  // }, []);

  const save = useCallback(() => {
    console.log('visu save');
  }, []);
  const closeAndDownloadData = useCallback(async () => {
    const data = await surveyUnitIdbService.get('1234');
    downloadDataAsJson(data, 'data');
    history.push('/');
  }, [history]);
  useEffect(() => {
    console.log(surveyUnit);
  }, [surveyUnit]);

  return (
    <>
      {loadingMessage && <Preloader message={loadingMessage} />}
      {error && <Error message={error} />}
      {questionnaireUrl && source && surveyUnit && suggesters && (
        <LightOrchestrator
          surveyUnit={surveyUnit}
          source={source}
          suggesters={suggesters}
          standalone={standalone}
          readonly={readonly}
          pagination={true}
          missing={true}
          save={save}
          filterDescription={false}
          quit={closeAndDownloadData}
          definitiveQuit={closeAndDownloadData}
        />
      )}
      {!questionnaireUrl && <QuestionnaireForm />}
    </>
  );
};

export default Visualizer;
