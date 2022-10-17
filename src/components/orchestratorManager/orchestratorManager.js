/* eslint-disable no-alert */
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import NotFound from 'components/shared/not-found';
import { AppContext } from 'components/app';
import { useAPI, useAPIRemoteData, useAuth } from 'utils/hook';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import paradataIdbService from 'utils/indexedbb/services/paradata-idb-service';
import { sendCloseEvent } from 'utils/communication';
import Orchestrator from '../orchestrator';
import { checkQuestionnaire } from 'utils/questionnaire';
import { buildSuggesterFromNomenclatures } from 'utils/questionnaire/nomenclatures';
import { EventsManager, INIT_ORCHESTRATOR_EVENT, INIT_SESSION_EVENT } from 'utils/events';
import { ORCHESTRATOR_COLLECT, ORCHESTRATOR_READONLY, READ_ONLY } from 'utils/constants';

const OrchestratorManager = () => {
  const { standalone, apiUrl } = useContext(AppContext);
  const { readonly: readonlyParam, idQ, idSU } = useParams();
  const history = useHistory();

  const [readonly] = useState(readonlyParam === READ_ONLY);

  const LOGGER = EventsManager.createEventLogger({
    idQuestionnaire: idQ,
    idSurveyUnit: idSU,
    idOrchestrator: readonly ? ORCHESTRATOR_READONLY : ORCHESTRATOR_COLLECT,
  });

  const { surveyUnit, questionnaire, nomenclatures, loadingMessage, errorMessage } =
    useAPIRemoteData(idSU, idQ);

  const { oidcUser } = useAuth();
  const isAuthenticated = !!oidcUser?.profile;

  const [suggesters, setSuggesters] = useState(null);

  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);
  const { putUeData, postParadata } = useAPI(idSU, idQ);

  const [init, setInit] = useState(false);

  useEffect(() => {
    /*
     * We add to the logger the new session (which will be store in paradata)
     */
    if (isAuthenticated && questionnaire) {
      LOGGER.addMetadata({ idSession: oidcUser?.session_state });
      LOGGER.log(INIT_SESSION_EVENT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, LOGGER, questionnaire]);

  useEffect(() => {
    if (!init && questionnaire && surveyUnit && nomenclatures) {
      const { valid, error: questionnaireError } = checkQuestionnaire(questionnaire);
      if (valid) {
        setSource(questionnaire);
        const suggestersBuilt = buildSuggesterFromNomenclatures(apiUrl)(nomenclatures);
        setSuggesters(suggestersBuilt);
        setInit(true);
        LOGGER.log(INIT_ORCHESTRATOR_EVENT);
      } else {
        setError(questionnaireError);
      }
    }
  }, [init, questionnaire, surveyUnit, nomenclatures, apiUrl, LOGGER]);

  useEffect(() => {
    if (errorMessage) setError(errorMessage);
  }, [errorMessage]);

  const [, /* sending */ setSending] = useState(false);
  const [, /* errorSending */ setErrorSending] = useState(false);

  const putSurveyUnit = async unit => {
    const { id, ...other } = unit;
    setErrorSending(null);
    setSending(true);
    const { /* status, */ error: putDataError } = await putUeData(id, other);
    setSending(false);
    if (putDataError) setErrorSending('Error during sending');
  };

  const saveData = async unit => {
    if (!readonly) {
      console.log('addOrUpdateIDB');
      await surveyUnitIdbService.addOrUpdateSU(unit);
      const paradatas = LOGGER.getEventsToSend();
      await paradataIdbService.update(paradatas);
      if (standalone) {
        // TODO managing errors
        await putSurveyUnit(unit);
        await postParadata(paradatas);
      }
    }
  };

  const closeOrchestrator = () => {
    if (standalone) {
      history.push('/');
    } else {
      sendCloseEvent(surveyUnit.id);
    }
  };
  return (
    <>
      {![READ_ONLY, undefined].includes(readonlyParam) && <NotFound />}
      {loadingMessage && <Preloader message={loadingMessage} />}
      {error && <Error message={error} />}
      {init && !loadingMessage && !errorMessage && source && surveyUnit && suggesters && (
        <Orchestrator
          surveyUnit={surveyUnit}
          source={source}
          suggesters={suggesters}
          autoSuggesterLoading
          standalone={standalone}
          readonly={readonly}
          savingType="COLLECTED"
          preferences={['COLLECTED']}
          features={['VTL']}
          pagination
          missing
          filterDescription={false}
          save={saveData}
          close={closeOrchestrator}
          placeholderList="Rechercher ici ..."
        />
      )}
    </>
  );
};

export default OrchestratorManager;
