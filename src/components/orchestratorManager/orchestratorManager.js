/* eslint-disable no-alert */
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import { AppContext } from 'components/app';
import { useAPI, useAPIRemoteData } from 'utils/hook';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { READ_ONLY } from 'utils/constants';
import D from 'i18n';
import * as UQ from 'utils/questionnaire';
import { sendCloseEvent } from 'utils/communication';
import Orchestrator from '../orchestrator';
import NotFound from '../shared/not-found';

const OrchestratorManager = () => {
  const configuration = useContext(AppContext);
  const { readonly: readonlyParam, idQ, idSU } = useParams();
  const { surveyUnit, questionnaire, loadingMessage, errorMessage } = useAPIRemoteData(idSU, idQ);

  const [source, setSource] = useState(null);
  const { putData, putComment } = useAPI(idSU, idQ);

  const [init, setInit] = useState(false);

  const [readonly] = useState(readonlyParam === READ_ONLY);

  /**
   * Build special questionnaire for Queen
   * Build special data of survey-unit for Queen
   */
  useEffect(() => {
    if (!init && questionnaire && surveyUnit) {
      const newQuestionnaire = {
        ...questionnaire,
        components: UQ.buildQueenQuestionnaire(questionnaire.components),
      };
      setSource(newQuestionnaire);
      setInit(true);
    }
  }, [init, questionnaire, surveyUnit]);

  const [, /* sending */ setSending] = useState(false);
  const [, /* errorSending */ setErrorSending] = useState(false);

  const putSurveyUnit = async unit => {
    const { comment, id, ...other } = unit;
    setErrorSending(null);
    setSending(true);
    const { /* status, */ error: putDataError } = await putData(other);
    const { /* status, */ error: putCommentError } = await putComment(comment);
    setSending(false);
    if (putDataError || putCommentError) setErrorSending('Error during sending');
  };

  const saveSU = async unit => {
    if (!readonly) {
      await surveyUnitIdbService.addOrUpdateSU(unit);
      if (configuration.standalone) await putSurveyUnit(unit);
    }
  };

  const closeOrchestrator = () => {
    if (configuration.standalone) {
      alert(D.closeWindow);
    } else {
      sendCloseEvent(surveyUnit.id);
    }
  };

  return (
    <>
      {![READ_ONLY, undefined].includes(readonlyParam) && <NotFound />}
      {loadingMessage && <Preloader message={loadingMessage} />}
      {errorMessage && <Error message={errorMessage} />}
      {init && !loadingMessage && !errorMessage && source && surveyUnit && (
        <Orchestrator
          surveyUnit={surveyUnit}
          source={source}
          standalone={configuration.standalone}
          readonly={readonly}
          savingType="COLLECTED"
          preferences={['COLLECTED']}
          features={['VTL']}
          filterDescription={false}
          save={saveSU}
          close={closeOrchestrator}
        />
      )}
    </>
  );
};

export default OrchestratorManager;
