import {
  getQuestionnaireById,
  getNomenclatureById,
  getDataSurveyUnitById,
  getCommentSurveyUnitById,
  getListRequiredNomenclature,
  getQuestionnaireByUrl,
} from 'utils/api';
import clearAllData from 'utils/indexedbb/services/allTables-idb-service';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import D from 'i18n';

export const initialize = ({
  visualize,
  configuration,
  idQuestionnaire,
  idSurveyUnit,
  setWaitingMessage,
  setQuestionnaire,
  setSurveyUnit,
}) => async () => {
  const { standalone, QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE } = configuration;

  // clean cache and database
  if (standalone) {
    setWaitingMessage(D.waitingCleaning);
    await clearAllData();
    await caches.delete('queen-questionnaire');
  }
  /**
   * Get questionnaire
   *    standalone mode : get from the API (always online)
   *    embedded mode   : get from the API or service-worker
   */
  setWaitingMessage(D.waitingQuestionnaire);
  let questionnaire;
  if (visualize) {
    const response = await getQuestionnaireByUrl(visualize);
    questionnaire = response.data;
  } else {
    const response = await getQuestionnaireById(
      QUEEN_API_URL,
      QUEEN_AUTHENTICATION_MODE
    )(idQuestionnaire);
    questionnaire = await response.data.model;
  }

  // set questionnaire to orchestrator
  if (questionnaire) {
    setQuestionnaire(questionnaire);
  } else {
    throw new Error(D.questionnaireNotFound);
  }

  /**
   * Get resources for questionnaire
   * (waiting for spec)
   */
  if (standalone && !visualize) {
    setWaitingMessage(D.waitingResources);
    const resourcesResponse = await getListRequiredNomenclature(
      QUEEN_API_URL,
      QUEEN_AUTHENTICATION_MODE
    )(idQuestionnaire);
    const resources = await resourcesResponse.data;
    await Promise.all(
      resources.map(async resourceId => {
        await getNomenclatureById(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(resourceId);
      })
    );
  }
  /**
   * Get survey-unit's data
   *    standalone mode : get data from API, then from database
   *    embedded mode   : get data from database
   */
  setWaitingMessage(D.waitingDataSU);
  if (standalone && !visualize) {
    const dataResponse = await getDataSurveyUnitById(
      QUEEN_API_URL,
      QUEEN_AUTHENTICATION_MODE
    )(idSurveyUnit);
    const surveyUnitData = await dataResponse.data;
    const commentResponse = await getCommentSurveyUnitById(
      QUEEN_API_URL,
      QUEEN_AUTHENTICATION_MODE
    )(idSurveyUnit);
    const surveyUnitComment = await commentResponse.data;
    await surveyUnitIdbService.addOrUpdateSU({
      id: idSurveyUnit,
      data: surveyUnitData,
      comment: surveyUnitComment,
    });
  }
  if (standalone && visualize) {
    await surveyUnitIdbService.addOrUpdateSU({
      id: '1234',
      data: {},
      comment: {},
    });
  }
  const surveyUnit = await surveyUnitIdbService.get(idSurveyUnit || '1234');
  if (surveyUnit) {
    // set survey unit data to orchestrator
    setSurveyUnit(surveyUnit);
  } else {
    throw new Error(D.surveyUnitNotFound);
  }
};
