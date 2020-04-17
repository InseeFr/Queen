import * as api from 'utils/api';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';

const getConfiguration = async () => {
  const publicUrl = new URL(process.env.PUBLIC_URL, self.location.href);
  const response = await fetch(`${publicUrl.origin}/configuration.json`);
  let configuration = await response.json();
  const responseFromQueen = await fetch(`${configuration.urlQueen}/configuration.json`);
  configuration = await responseFromQueen.json();
  return configuration;
};

const putQuestionnaireInCache = async (urlQueenApi, token, id) => {
  await api.getQuestionnaireById(urlQueenApi, token)(id);
};

const putResourcesInCache = async (urlQueenApi, token, operationId) => {
  const resourcesResponse = await api.getListRequiredNomenclature(urlQueenApi, token)(operationId);
  const resources = await resourcesResponse.data;
  await Promise.all(
    resources.map(async resource => {
      const { id } = resource;
      await api.getNomenclatureById(urlQueenApi, token)(id);
    })
  );
};

const putSurveyUnitInDataBase = async (urlQueenApi, token, id) => {
  const dataResponse = await api.getDataSurveyUnitById(urlQueenApi, token)(id);
  const surveyUnitData = await dataResponse.data;
  const commentResponse = await api.getCommentSurveyUnitById(urlQueenApi, token)(id);
  const surveyUnitComment = await commentResponse.data;
  await surveyUnitIdbService.addOrUpdateSU({
    idSU: id,
    data: surveyUnitData,
    comment: surveyUnitComment,
  });
};

const putSurveyUnitsInDataBaseByOperationId = async (urlQueenApi, token, operationId) => {
  const surveyUnitsResponse = await api.getSurveyUnitByIdOperation(urlQueenApi, token)(operationId);
  const surveyUnits = await surveyUnitsResponse.data;
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const { id } = surveyUnit;
      await putSurveyUnitInDataBase(urlQueenApi, token, id);
    })
  );
};

const sendData = async (urlQueenApi, token) => {
  const surveyUnits = await surveyUnitIdbService.getAll();
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const { idSU, data, comment } = surveyUnit;
      await api.putDataSurveyUnitById(urlQueenApi, token)(idSU, data);
      await api.putCommentSurveyUnitById(urlQueenApi, token)(idSU, comment);
    })
  );
};

const clean = async () => {
  await surveyUnitIdbService.deleteAll();
};

export const synchronize = async () => {
  // (0) : get configuration
  const { urlQueenApi, authenticationMode } = await getConfiguration();
  let token = null;

  // (1) : authentication
  if (authenticationMode === 'keycloak') {
    token = undefined; // TODO get new keycloak token;
  }

  // (2) : send the local data to server
  await sendData(urlQueenApi, token);

  // (3) : clean
  await clean();

  // (4) : Get the data
  const operationsResponse = await api.getOperations(urlQueenApi, token);
  const operations = await operationsResponse.data;

  await Promise.all(
    operations.map(async operation => {
      const { id } = operation;
      await putQuestionnaireInCache(urlQueenApi, token, id);
      await putResourcesInCache(urlQueenApi, token, id);
      await putSurveyUnitsInDataBaseByOperationId(urlQueenApi, token, id);
    })
  );
};
