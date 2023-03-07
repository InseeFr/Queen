import { COMPLETED, VALIDATED, useQuestionnaireState } from 'utils/hook/questionnaire';
import { EventsManager, INIT_ORCHESTRATOR_EVENT, INIT_SESSION_EVENT } from 'utils/events';
import { ORCHESTRATOR_COLLECT, ORCHESTRATOR_READONLY, READ_ONLY } from 'utils/constants';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useAPI, useAPIRemoteData, useAuth } from 'utils/hook';
import { useHistory, useParams } from 'react-router-dom';

import { AppContext } from 'components/app';
import Error from 'components/shared/Error';
import LightOrchestrator from 'components/lightOrchestrator';
import NotFound from 'components/shared/not-found';
import Preloader from 'components/shared/preloader';
import { buildSuggesterFromNomenclatures } from 'utils/questionnaire/nomenclatures';
import { checkQuestionnaire } from 'utils/questionnaire';
import paradataIdbService from 'utils/indexedbb/services/paradata-idb-service';
import { sendCloseEvent } from 'utils/communication';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';

export const OrchestratorManager = () => {
  console.log('OrchestratorManager renders');
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
  console.log(surveyUnit);
  //TODO improve null handling
  const stateData = surveyUnit?.stateData;
  const initialData = surveyUnit?.data;
  const { oidcUser } = useAuth();
  const isAuthenticated = !!oidcUser?.profile;

  const [suggesters, setSuggesters] = useState(null);

  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);
  const { putUeData, postParadata } = useAPI(idSU, idQ);

  const [init, setInit] = useState(false);

  const [state, changeState, onDataChange] = useQuestionnaireState(
    surveyUnit?.id,
    initialData,
    stateData?.state
  );

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

  const saveData = useCallback(
    async unit => {
      if (!readonly) {
        const putSurveyUnit = async unit => {
          const { id, ...other } = unit;
          setErrorSending(null);
          setSending(true);
          const { error: putDataError } = await putUeData(id, other);
          setSending(false);
          if (putDataError) setErrorSending('Error during sending');
        };

        await surveyUnitIdbService.addOrUpdateSU(unit);
        const paradatas = LOGGER.getEventsToSend();
        await paradataIdbService.update(paradatas);
        if (standalone) {
          // TODO managing errors
          await putSurveyUnit(unit);
          await postParadata(paradatas);
        }
      }
    },
    [LOGGER, postParadata, putUeData, readonly, standalone]
  );

  const saveQueen = useCallback(
    async (lastState, newData, page) => {
      console.log({ lastState, newData, page, state, surveyUnit });
      saveData({
        comment: {},
        ...surveyUnit,
        stateData: {
          state: lastState ?? state,
          date: new Date().getTime(),
          currentPage: page,
        },
        data: newData ?? surveyUnit.data,
      });
    },
    [saveData, state, surveyUnit]
  );

  const closeOrchestrator = useCallback(() => {
    if (standalone) {
      history.push('/');
    } else {
      sendCloseEvent(surveyUnit.id);
    }
  }, [history, standalone, surveyUnit?.id]);

  const quit = useCallback(
    async (pager, getData) => {
      const { page, maxPage } = pager;
      const isLastPage = page === maxPage;
      const newData = getData();
      if (isLastPage(pager)) {
        // TODO : make algo to calculate COMPLETED event
        changeState(COMPLETED);
        changeState(VALIDATED);
        await saveQueen(VALIDATED, newData, page);
      } else await saveQueen(undefined, newData, page);
      closeOrchestrator();
    },
    [changeState, closeOrchestrator, saveQueen]
  );

  const definitiveQuit = useCallback(
    async (pager, getData) => {
      const { page } = pager;
      const newData = getData();
      changeState(VALIDATED);
      await saveQueen(VALIDATED, newData, page);
      closeOrchestrator();
    },
    [changeState, closeOrchestrator, saveQueen]
  );

  return (
    <>
      {![READ_ONLY, undefined].includes(readonlyParam) && <NotFound />}
      {loadingMessage && <Preloader message={loadingMessage} />}
      {error && <Error message={error} />}
      {init && !loadingMessage && !errorMessage && source && surveyUnit && suggesters && (
        <LightOrchestrator
          surveyUnit={surveyUnit}
          source={source}
          suggesters={suggesters}
          autoSuggesterLoading={true}
          standalone={standalone}
          readonly={readonly}
          savingType="COLLECTED"
          preferences={['COLLECTED']}
          features={['VTL']}
          pagination={true}
          missing={true}
          filterDescription={false}
          save={saveQueen}
          onDataChange={onDataChange}
          close={closeOrchestrator}
          quit={quit}
          definitiveQuit={definitiveQuit}
        />
      )}
    </>
  );
};
