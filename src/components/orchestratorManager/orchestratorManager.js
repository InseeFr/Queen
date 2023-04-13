import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ORCHESTRATOR_COLLECT, ORCHESTRATOR_READONLY, READ_ONLY } from 'utils/constants';
import { EventsManager, INIT_ORCHESTRATOR_EVENT, INIT_SESSION_EVENT } from 'utils/events';
import { useAPI, useAPIRemoteData, useAuth, useGetReferentiel } from 'utils/hook';
import { COMPLETED, VALIDATED, useQuestionnaireState } from 'utils/hook/questionnaire';

import { AppContext } from 'components/app';
import LightOrchestrator from 'components/lightOrchestrator';
import Error from 'components/shared/Error';
import NotFound from 'components/shared/not-found';
import Preloader from 'components/shared/preloader';
import { sendCloseEvent } from 'utils/communication';
import paradataIdbService from 'utils/indexedbb/services/paradata-idb-service';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { checkQuestionnaire } from 'utils/questionnaire';

export const OrchestratorManager = () => {
  const { standalone, apiUrl } = useContext(AppContext);
  const { readonly: readonlyParam, idQ, idSU } = useParams();
  const history = useHistory();

  const readonly = readonlyParam === READ_ONLY;

  const LOGGER = useMemo(
    () =>
      EventsManager.createEventLogger({
        idQuestionnaire: idQ,
        idSurveyUnit: idSU,
        idOrchestrator: readonly ? ORCHESTRATOR_READONLY : ORCHESTRATOR_COLLECT,
      }),
    [idQ, idSU, readonly]
  );

  const { surveyUnit, questionnaire, nomenclatures, loadingMessage, errorMessage } =
    useAPIRemoteData(idSU, idQ);

  const stateData = surveyUnit?.stateData;
  const initialData = surveyUnit?.data;
  const { oidcUser } = useAuth();
  const isAuthenticated = !!oidcUser?.profile;

  const { getReferentiel } = useGetReferentiel();
  const [init, setInit] = useState(false);

  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);
  const { putUeData, postParadata } = useAPI();
  console.log({ stateData });
  const [getState, changeState, onDataChange] = useQuestionnaireState(
    surveyUnit?.id,
    initialData,
    stateData?.state
  );

  useEffect(() => {
    /*
     * We add to the logger the new session (which will be store in paradata)
     */
    if (isAuthenticated && questionnaire) {
      LOGGER.addMetadata({ idSession: oidcUser.session_state });
      LOGGER.log(INIT_SESSION_EVENT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, LOGGER, questionnaire]);

  useEffect(() => {
    if (!init && questionnaire && surveyUnit) {
      const { valid, error: questionnaireError } = checkQuestionnaire(questionnaire);
      if (valid) {
        setSource(questionnaire);
        setInit(true);
        LOGGER.log(INIT_ORCHESTRATOR_EVENT);
      } else {
        setError(questionnaireError);
      }
    }
  }, [questionnaire, surveyUnit, nomenclatures, apiUrl, LOGGER, init]);

  useEffect(() => {
    if (errorMessage) setError(errorMessage);
  }, [errorMessage]);

  /** take a survey-unit as parameter, then save it in IDB, then save paradatas in IDB
   *  If in standalone mode : make API calls to persist data in DB
   */
  const saveData = useCallback(
    async unit => {
      if (!readonly) {
        const putSurveyUnit = async unit => {
          const { id, ...other } = unit;
          await putUeData(id, other);
        };

        await surveyUnitIdbService.addOrUpdateSU(unit);
        const paradatas = LOGGER.getEventsToSend();
        // TODO : make a true update of paradatas : currently adding additional completed arrays => SHOULD save one and only one array
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
    async (newState, newData, page) => {
      const currentState = getState();
      console.log('save queen', { newState, newData, page, currentState, surveyUnit });
      saveData({
        comment: {},
        ...surveyUnit,
        stateData: {
          state: newState ?? currentState,
          date: new Date().getTime(),
          currentPage: page,
        },
        data: newData ?? surveyUnit.data,
      });
    },
    [getState, saveData, surveyUnit]
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
      if (isLastPage) {
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
      {!loadingMessage && !error && source && surveyUnit && (
        <LightOrchestrator
          surveyUnit={surveyUnit}
          source={source}
          getReferentiel={getReferentiel}
          autoSuggesterLoading={true}
          standalone={standalone}
          readonly={readonly}
          savingType="COLLECTED"
          pagination={true}
          missing={true}
          shortcut={true}
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
