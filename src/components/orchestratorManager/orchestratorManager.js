import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import { initialize } from 'utils/initializeOrchestrator';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { AUTHENTICATION_MODE_ENUM, READ_ONLY } from 'utils/constants';
import D from 'i18n';
import * as UQ from 'utils/questionnaire';
import { sendCloseEvent } from 'utils/communication';
import * as api from 'utils/api';
import Orchestrator from '../orchestrator';
import NotFound from '../shared/not-found';

const OrchestratorManager = ({ match, configuration, visualize = null }) => {
  const [init, setInit] = useState(false);

  const [questionnaire, setQuestionnaire] = useState(undefined);
  const [dataSU, setDataSU] = useState(undefined);

  const [surveyUnit, setSurveyUnit] = useState(undefined);

  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);

  const [waitingMessage, setWaitingMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [readonly, setReadonly] = useState(false);

  useEffect(() => {
    if (!init) {
      if ([READ_ONLY, undefined].includes(match.params.readonly)) {
        setReadonly(match.params.readonly === READ_ONLY);
        setWaiting(true);
        const initOrchestrator = async () => {
          try {
            const initialization = initialize({
              visualize,
              configuration,
              idQuestionnaire: match.params.idQ,
              idSurveyUnit: match.params.idSU,
              setWaitingMessage,
              setQuestionnaire,
              setSurveyUnit,
            });
            await initialization();
          } catch (e) {
            setError(true);
            setErrorMessage(e.message);
            setWaiting(false);
            setInit(true);
          }
        };
        initOrchestrator();
      }
    }
  }, [init, configuration, match.params.readonly, match.params.idQ, match.params.idSU, visualize]);

  /**
   * Build special questionnaire for Queen
   * Build special data of survey-unit for Queen
   */
  useEffect(() => {
    if (!init && questionnaire && surveyUnit) {
      const { data, ...other } = surveyUnit;
      setSurveyUnit(other);
      const newDataSU = UQ.buildSpecialQueenData(data);
      // TODO : replace simpsons by questionnaire when queen-bo render last version of lunatic questionnaire
      const newQuestionnaire = {
        ...questionnaire,
        components: UQ.buildQueenQuestionnaire(questionnaire.components),
      };
      setQuestionnaire(newQuestionnaire);
      setDataSU(newDataSU);

      setWaiting(false);
      setInit(true);
    }
  }, [init, questionnaire, surveyUnit]);

  const putSurveyUnit = async unit => {
    try {
      await api.putDataSurveyUnitById(
        configuration.QUEEN_API_URL,
        configuration.QUEEN_AUTHENTICATION_MODE
      )(unit.id, unit.data);
      await api.putCommentSurveyUnitById(
        configuration.QUEEN_API_URL,
        configuration.QUEEN_AUTHENTICATION_MODE
      )(unit.id, unit.comment);
    } catch (e) {
      setError(true);
      setErrorMessage(`${D.putSurveyUnitFailed} : ${e.message}`);
    }
  };

  const saveSU = async unit => {
    if (!readonly) {
      await surveyUnitIdbService.addOrUpdateSU(unit);
      if (configuration.standalone && !visualize) await putSurveyUnit(unit);
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
      {![READ_ONLY, undefined].includes(match.params.readonly) && <NotFound />}
      {waiting && <Preloader message={waitingMessage} />}
      {error && <Error message={errorMessage} />}
      {!waiting && !error && questionnaire && surveyUnit && (
        <Orchestrator
          surveyUnit={surveyUnit}
          source={questionnaire}
          dataSU={dataSU}
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

OrchestratorManager.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      readonly: PropTypes.node,
      idQ: PropTypes.node,
      idSU: PropTypes.node,
    }),
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  configuration: PropTypes.shape({
    standalone: PropTypes.bool.isRequired,
    QUEEN_URL: PropTypes.string.isRequired,
    QUEEN_API_URL: PropTypes.string.isRequired,
    QUEEN_AUTHENTICATION_MODE: PropTypes.oneOf(AUTHENTICATION_MODE_ENUM).isRequired,
  }).isRequired,
  visualize: PropTypes.string.isRequired,
};

export default OrchestratorManager;
