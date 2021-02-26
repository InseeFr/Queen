import { fetcher } from './fetcher';

const getRequest = url => token => fetcher(url, token, 'GET', null);
const putRequest = url => token => body => fetcher(url, token, 'PUT', body);

/* All surveyUnits */
const getSurveyUnits = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/campaign/${id}/survey-units`)(token);

/* SurveyUnit's data */
const getData = apiUrl => id => token => getRequest(`${apiUrl}/api/survey-unit/${id}/data`)(token);
const putData = apiUrl => id => token => body =>
  putRequest(`${apiUrl}/api/survey-unit/${id}/data`)(token)(body);

/* SurveyUnit's comment */
const getComment = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/survey-unit/${id}/comment`)(token);
const putComment = apiUrl => id => token => body =>
  putRequest(`${apiUrl}/api/survey-unit/${id}/comment`)(token)(body);

/* Campaigns */
const getCampaigns = apiUrl => token => getRequest(`${apiUrl}/api/campaigns`)(token);

/* Questionnaire's resources */
const getQuestionnaire = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/campaign/${id}/questionnaire`)(token);
const getRequiredNomenclatures = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/campaign/${id}/required-nomenclatures`)(token);
const getNomenclature = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/nomenclature/${id}`)(token);

export const API = {
  getRequest,
  getSurveyUnits,
  getData,
  putData,
  getComment,
  putComment,
  getCampaigns,
  getQuestionnaire,
  getRequiredNomenclatures,
  getNomenclature,
};
