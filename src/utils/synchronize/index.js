import {
  getOperations,
  getQuestionnaireById,
  getDataSurveyUnitById,
  getCommentSurveyUnitById,
  getSurveyUnitByIdOperation,
} from 'utils/api';
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
  await getQuestionnaireById(urlQueenApi, token)(id);
};

const putSurveyUnitInDataBase = async (urlQueenApi, token, id) => {
  const dataResponse = await getDataSurveyUnitById(urlQueenApi, token)(id);
  const surveyUnitData = await dataResponse.data;
  const commentResponse = await getCommentSurveyUnitById(urlQueenApi, token)(id);
  const surveyUnitComment = await commentResponse.data;
  await surveyUnitIdbService.addOrUpdateSU({
    idSU: id,
    data: surveyUnitData,
    comment: surveyUnitComment,
  });
};

const putSurveyUnitsInDataBaseByOperationId = async (urlQueenApi, token, operationId) => {
  const surveyUnits = await getSurveyUnitByIdOperation(urlQueenApi, token)(operationId);
  await Promise.all(
    surveyUnits.map(async surveyUnit => {
      const { id } = surveyUnit;
      await putSurveyUnitInDataBase(urlQueenApi, token, id)();
    })
  );
};

export const synchronize = async () => {
  const { urlQueenApi, authenticationMode } = await getConfiguration();
  let token = null;

  if (authenticationMode === 'keycloak') {
    token = undefined; // TODO get new keycloak token;
  }

  const operationsResponse = await getOperations(urlQueenApi, token);
  const operations = await operationsResponse.data;

  await Promise.all(
    operations.map(async operation => {
      const { id } = operation;
      await putQuestionnaireInCache(urlQueenApi, token, id);
      await putSurveyUnitsInDataBaseByOperationId(urlQueenApi, token, id);
    })
  );
};
