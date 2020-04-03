import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import { initialize } from 'utils/initializeOrchestrator';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { AUTHENTICATION_MODE_ENUM, READ_ONLY } from 'utils/constants';
import D from 'i18n';
import * as UQ from 'utils/questionnaire';
import Orchestrator from '../orchestrator';
import NotFound from '../shared/not-found';

const OrchestratorManager = ({ match, configuration }) => {
  const [init, setInit] = useState(false);

  const [questionnaire, setQuestionnaire] = useState(undefined);
  const [surveyUnit, setSurveyUnit] = useState(undefined);

  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);

  const [waitingMessage, setWaitingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [readonly, setReadonly] = useState(false);

  useEffect(() => {
    if (!init) {
      if ([READ_ONLY, undefined].includes(match.params.readonly)) {
        setReadonly(match.params.readonly === READ_ONLY);
        setWaiting(true);
        const initOrchestrator = async () => {
          try {
            const initialization = initialize(
              configuration,
              match.params.idQ,
              match.params.idSU,
              setWaitingMessage,
              setQuestionnaire,
              setSurveyUnit
            );
            await initialization();
            setWaiting(false);
            setInit(true);
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
  }, [init]);

  const saveDataSU = data => {
    const surveyUnitTemp = surveyUnit;
    surveyUnitTemp.data = data;
    surveyUnitIdbService.addOrUpdateSU(surveyUnitTemp);
  };

  const closeOrchestrator = () => {
    if (!configuration.standalone) {
      console.log('sending event to close');
    } else {
      alert(D.closeWindow);
    }
  };
  return (
    <>
      {![READ_ONLY, undefined].includes(match.params.readonly) && <NotFound />}
      {waiting && <Preloader message={waitingMessage} />}
      {error && <Error message={errorMessage} />}
      {!waiting && !error && questionnaire && surveyUnit && (
        <Orchestrator
          readonly={readonly}
          savingType="COLLECTED"
          preferences={['COLLECTED']}
          source={questionnaire}
          dataSU={UQ.buildQueenData(surveyUnit.data)}
          filterDescription={false}
          save={saveDataSU}
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
  configuration: PropTypes.shape({
    standalone: PropTypes.bool.isRequired,
    urlQueen: PropTypes.string.isRequired,
    urlQueenApi: PropTypes.string.isRequired,
    authenticationMode: PropTypes.oneOf(AUTHENTICATION_MODE_ENUM).isRequired,
  }).isRequired,
};

export default OrchestratorManager;
