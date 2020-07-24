import * as api from 'utils/api';
import D from 'i18n';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import { QUEEN_URL } from 'utils/constants';
import { kc } from 'utils/keycloak';

const getConfiguration = async () => {
  const response = await fetch(`${QUEEN_URL}/configuration.json`);
  const configuration = await response.json();
  return configuration;
};

const putQuestionnaireInCache = async (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id) => {
  await api.getQuestionnaireById(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(id);
};

const putResourcesInCache = async (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, operationId) => {
  const resourcesResponse = await api.getListRequiredNomenclature(
    QUEEN_API_URL,
    QUEEN_AUTHENTICATION_MODE
  )(operationId);
  const resources = await resourcesResponse.data;
  await Promise.all(
    resources.map(async resourceId => {
      await api.getNomenclatureById(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(resourceId);
    })
  );
};

const putSurveyUnitInDataBase = async (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id) => {
  const dataResponse = await api.getDataSurveyUnitById(
    QUEEN_API_URL,
    QUEEN_AUTHENTICATION_MODE
  )(id);
  const surveyUnitData = await dataResponse.data;
  const commentResponse = await api.getCommentSurveyUnitById(
    QUEEN_API_URL,
    QUEEN_AUTHENTICATION_MODE
  )(id);
  const surveyUnitComment = await commentResponse.data;
  await surveyUnitIdbService.addOrUpdateSU({
    id,
    data: surveyUnitData,
    comment: surveyUnitComment,
  });
};

const putSurveyUnitsInDataBaseByOperationId = async (
  QUEEN_API_URL,
  QUEEN_AUTHENTICATION_MODE,
  operationId
) => {
  const surveyUnitsResponse = await api.getSurveyUnitByIdOperation(
    QUEEN_API_URL,
    QUEEN_AUTHENTICATION_MODE
  )(operationId);
  const surveyUnits = await surveyUnitsResponse.data;
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const { id } = surveyUnit;
      await putSurveyUnitInDataBase(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id);
    })
  );
};

const sendData = async (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => {
  const surveyUnits = await surveyUnitIdbService.getAll();
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const { id, data, comment } = surveyUnit;
      await api.putDataSurveyUnitById(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(id, data);
      await api.putCommentSurveyUnitById(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE)(id, comment);
    })
  );
};

const clean = async () => {
  await surveyUnitIdbService.deleteAll();
};

const authentication = () =>
  new Promise((resolve, reject) => {
    if (navigator.onLine) {
      kc.init()
        .then(authenticated => {
          resolve(authenticated);
        })
        .catch(e => reject(e));
    } else {
      resolve();
    }
  });

export const synchronize = async config => {
  if (config && config.setWaitingMessage) config.setWaitingMessage(D.waitingConfiguration);
  // (0) : get configuration
  const { QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE } = await getConfiguration();

  // (1) : authentication
  if (config && config.setWaitingMessage) config.setWaitingMessage(D.waitingAuthentication);
  if (QUEEN_AUTHENTICATION_MODE === 'keycloak') {
    await authentication();
  }

  if (config && config.setWaitingMessage) config.setWaitingMessage(D.waitingSendingData);
  // (2) : send the local data to server
  await sendData(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE);

  // (3) : clean
  if (config && config.setWaitingMessage) config.setWaitingMessage(D.waitingCleaning);
  await clean();

  // (4) : Get the data
  if (config && config.setWaitingMessage) config.setWaitingMessage(D.waitingLoadingOperations);
  const operationsResponse = await api.getOperations(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE);
  const operations = await operationsResponse.data;

  await Promise.all(
    operations.map(async operation => {
      const { id } = operation;
      if (config && config.setWaitingMessage)
        config.setWaitingMessage(D.waitingLoadingQuestionnaire);
      await putQuestionnaireInCache(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id);
      if (config && config.setWaitingMessage) config.setWaitingMessage(D.waitingLoadingResources);
      await putResourcesInCache(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id);
      if (config && config.setWaitingMessage) config.setWaitingMessage(D.waitingLoadingSU);
      await putSurveyUnitsInDataBaseByOperationId(QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE, id);
    })
  );
};
