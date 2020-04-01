import { getQuestionnaireById, getResourceById, getDataSurveyUnitById } from 'utils/api';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import D from 'i18n';

export const initialize = ({
  configuration,
  idQuestionnaire,
  idSurveyUnit,
  setWaitingMessage,
  setQuestionnaire,
  setSurveyUnit,
}) => {
  const { standalone, urlQueenApi } = configuration;
  const init = async () => {
    /**
     * Get questionnaire
     *    standalone mode : get from the API (always online)
     *    embedded mode   : get from the API or service-worker
     */
    setWaitingMessage(D.waitingQuestionnaire);
    const fetchedQuestionnaire = await getQuestionnaireById(urlQueenApi, idQuestionnaire);
    // set questionnaire to orchestrator
    setQuestionnaire(fetchedQuestionnaire);

    /**
     * Get resources for questionnaire
     * (waiting for spec)
     */
    if (standalone) {
      setWaitingMessage(D.waitingResources);
      await getResourceById(idQuestionnaire);
    }
    /**
     * Get survey-unit's data
     *    standalone mode : get data from API, then from database
     *    embedded mode   : get data from database
     */
    setWaitingMessage(D.waitingDataSU);
    if (standalone) {
      const fetchedData = await getDataSurveyUnitById(idSurveyUnit);
      await surveyUnitIdbService.addOrUpdateSU({ idSU: idSurveyUnit, data: fetchedData });
    }
    const surveyUnit = await surveyUnitIdbService.getByIdSU(idSurveyUnit);
    // set survey unit data to orchestrator
    setSurveyUnit(surveyUnit);
  };
  return init;
};
