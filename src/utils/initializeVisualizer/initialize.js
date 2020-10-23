import { getQuestionnaireByUrl } from 'utils/api';
import clearAllData from 'utils/indexedbb/services/allTables-idb-service';
import D from 'i18n';

export const initialize = ({
  questionnaireUrl,
  configuration,
  setWaitingMessage,
  setQuestionnaire,
}) => async () => {
  const { standalone } = configuration;

  // clean cache and database
  if (standalone) {
    setWaitingMessage(D.waitingCleaning);
    await clearAllData();
    await caches.delete('queen-questionnaire');
  }
  setWaitingMessage(D.waitingQuestionnaire);
  const response = await getQuestionnaireByUrl(questionnaireUrl);
  const questionnaire = response.data;

  // set questionnaire to orchestrator
  if (questionnaire) {
    setQuestionnaire(questionnaire);
  } else {
    throw new Error(D.questionnaireNotFound);
  }
};
