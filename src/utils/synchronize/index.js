/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
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

self.onmessage = event => {
  const synchronize = async () => {
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

  if (event.data.type === 'QUEEN') {
    const launchSynchronize = async () => {
      console.log('Queen synchronization : STARTED !');
      try {
        await synchronize();
        self.postMessage({ type: 'QUEEN_WORKER', state: 'SUCCESS' });
      } catch (e) {
        console.log(e.message);
        self.postMessage({ type: 'QUEEN_WORKER', state: 'FAILURE' });
      } finally {
        console.log('Queen synchronization : ENDED !');
      }
    };
    launchSynchronize();
  }
};

/*
1 : auth
2 : post des datas et comment
3 : 
 - GET : operations /api/operations -> {idOP}
 - GET : questionnaire /api/operation/{idOP}/questionnaire pour chaque OP
 - GET : id survey-unit /api/operation/{idOP}/reporting-units pour chaque OP -> {surveyUnitID}
 -> pour chaque suveyUnitID
      - GET : data  /api/reporting-unit/{surveyUnitID}/data
      - GET : comment /api/reporting-unit/{surveyUnitID}/comment

*/
