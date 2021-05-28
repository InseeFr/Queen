import { fetcher } from './fetcher';

const getRequest = url => token => fetcher(url, token, 'GET', null);
const putRequest = url => token => body => fetcher(url, token, 'PUT', body);

/* All surveyUnits */
const getSurveyUnits = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/campaign/${id}/survey-units`)(token);

/* SurveyUnit's data */
const getUeData = apiUrl => id => token => getRequest(`${apiUrl}/api/survey-unit/${id}`)(token);
const putUeData = apiUrl => id => token => body =>
  putRequest(`${apiUrl}/api/survey-unit/${id}`)(token)(body);

/* Campaigns */
const getCampaigns = apiUrl => token => getRequest(`${apiUrl}/api/campaigns`)(token);

/* Questionnaire's resources */
const getQuestionnaire = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/questionnaire/${id}`)(token);
const getRequiredNomenclatures = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/questionnaire/${id}/required-nomenclatures`)(token);
const getNomenclature = apiUrl => id => token =>
  getRequest(`${apiUrl}/api/nomenclature/${id}`)(token);

export const API = {
  getRequest,
  getSurveyUnits,
  getUeData,
  putUeData,
  getCampaigns,
  getQuestionnaire,
  getRequiredNomenclatures,
  getNomenclature,
};
