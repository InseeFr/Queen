import { useCallback, useContext, useEffect, useState } from 'react';
import { useGetReferentiel, useRemoteData, useVisuQuery } from 'utils/hook';
import { checkQuestionnaire, downloadDataAsJson } from 'utils/questionnaire';

import { AppContext } from 'components/app';
import LightOrchestrator from 'components/lightOrchestrator';
import Error from 'components/shared/Error';
import Preloader from 'components/shared/preloader';
import { useHistory } from 'react-router';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import QuestionnaireForm from './questionnaireForm';

const Visualizer = () => {
  const { apiUrl, standalone } = useContext(AppContext);

  const [surveyUnit, setSurveyUnit] = useState(undefined);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  const { questionnaireUrl, dataUrl, nomenclatures, readonly } = useVisuQuery();
  const {
    surveyUnit: suData,
    questionnaire,
    loadingMessage,
    errorMessage,
  } = useRemoteData(questionnaireUrl, dataUrl);

  const { getReferentielForVizu } = useGetReferentiel(nomenclatures);

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
    if (questionnaireUrl && questionnaire && suData) {
      const { valid, error: questionnaireError } = checkQuestionnaire(questionnaire);
      if (valid) {
        setSource(questionnaire);
      } else {
        setError(questionnaireError);
      }
    }
  }, [questionnaireUrl, questionnaire, suData, apiUrl]);

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
      {questionnaireUrl && source && surveyUnit && (
        <LightOrchestrator
          surveyUnit={surveyUnit}
          source={source}
          autoSuggesterLoading={true}
          getReferentiel={getReferentielForVizu}
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
