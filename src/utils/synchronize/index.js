import * as api from 'utils/api';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';

const getConfiguration = async () => {
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  const response = await fetch(`${publicUrl.origin}/configuration.json`);
  let configuration = await response.json();
  const responseFromQueen = await fetch(`${configuration.QUEEN_URL}/configuration.json`);
  configuration = await responseFromQueen.json();
  return configuration;
};

const putQuestionnaireInCache = async (QUEEN_API_URL, token, id) => {
  await api.getQuestionnaireById(QUEEN_API_URL, token)(id);
};

const putResourcesInCache = async (QUEEN_API_URL, token, operationId) => {
  const resourcesResponse = await api.getListRequiredNomenclature(
    QUEEN_API_URL,
    token
  )(operationId);
  const resources = await resourcesResponse.data;
  await Promise.all(
    resources.map(async resourceId => {
      await api.getNomenclatureById(QUEEN_API_URL, token)(resourceId);
    })
  );
};

const putSurveyUnitInDataBase = async (QUEEN_API_URL, token, id) => {
  const dataResponse = await api.getDataSurveyUnitById(QUEEN_API_URL, token)(id);
  const surveyUnitData = await dataResponse.data;
  const commentResponse = await api.getCommentSurveyUnitById(QUEEN_API_URL, token)(id);
  const surveyUnitComment = await commentResponse.data;
  await surveyUnitIdbService.addOrUpdateSU({
    id,
    data: surveyUnitData,
    comment: surveyUnitComment,
  });
};

const putSurveyUnitsInDataBaseByOperationId = async (QUEEN_API_URL, token, operationId) => {
  const surveyUnitsResponse = await api.getSurveyUnitByIdOperation(
    QUEEN_API_URL,
    token
  )(operationId);
  const surveyUnits = await surveyUnitsResponse.data;
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const { id } = surveyUnit;
      await putSurveyUnitInDataBase(QUEEN_API_URL, token, id);
    })
  );
};

const sendData = async (QUEEN_API_URL, token) => {
  const surveyUnits = await surveyUnitIdbService.getAll();
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const { id, data, comment } = surveyUnit;
      await api.putDataSurveyUnitById(QUEEN_API_URL, token)(id, data);
      await api.putCommentSurveyUnitById(QUEEN_API_URL, token)(id, comment);
    })
  );
};

const clean = async () => {
  await surveyUnitIdbService.deleteAll();
};

export const synchronize = async () => {
  // (0) : get configuration
  const { QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE } = await getConfiguration();
  let token = null;

  // (1) : authentication
  if (QUEEN_AUTHENTICATION_MODE === 'keycloak') {
    token = undefined; // TODO get new keycloak token;
  }

  // (2) : send the local data to server
  await sendData(QUEEN_API_URL, token);

  // (3) : clean
  await clean();

  // (4) : Get the data
  const operationsResponse = await api.getOperations(QUEEN_API_URL, token);
  const operations = await operationsResponse.data;

  await Promise.all(
    operations.map(async operation => {
      const { id } = operation;
      await putQuestionnaireInCache(QUEEN_API_URL, token, id);
      await putResourcesInCache(QUEEN_API_URL, token, id);
      await putSurveyUnitsInDataBaseByOperationId(QUEEN_API_URL, token, id);
    })
  );
};
