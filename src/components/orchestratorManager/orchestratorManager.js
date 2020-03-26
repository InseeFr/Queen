import React, { useState, useEffect } from 'react';
import Preloader from 'components/shared/preloader';
import D from 'i18n';
import { getQuestionnaireById, getResourceById, getDataSurveyUnitById } from 'utils/api';
import Orchestrator from '../orchestrator';

const OrchestratorManager = ({ match, standalone, authenticationMode }) => {
  const [questionnaire, setQuestionnaire] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [waiting, setWaiting] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState('');

  useEffect(() => {
    if (!questionnaire) {
      const init = async () => {
        setWaiting(true);
        setWaitingMessage(D.waitingQuestionnaire);
        const fetchedQuestionnaire = await getQuestionnaireById(match.params.idQ);
        setWaitingMessage(D.waitingResources);
        await getResourceById(match.params.idQ);
        setWaitingMessage(D.waitingDataSU);
        const fetchedData = await getDataSurveyUnitById(match.params.idSU);

        setQuestionnaire(fetchedQuestionnaire);
        setData(fetchedData);
        setWaiting(false);
      };
      init();
    }
  }, [questionnaire]);

  return (
    <>
      {waiting && <Preloader message={waitingMessage} />}
      {!waiting && questionnaire && (
        <Orchestrator
          savingType="COLLECTED"
          preferences={['COLLECTED']}
          source={questionnaire}
          data={data}
          filterDescription={false}
        />
      )}
    </>
  );
};

export default OrchestratorManager;
