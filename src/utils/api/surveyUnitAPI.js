import Axios from 'axios';
import { authentication, getHeader } from './api';
// import data from '../fake-survey/data.json';

export const getSurveyUnitByIdCampaign = (apiUrl, authenticationMode) => id =>
  new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.get(`${apiUrl}/api/campaign/${id}/survey-units`, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to fetch survey-units of campaign (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });

export const getDataSurveyUnitById = (apiUrl, authenticationMode) => id =>
  new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.get(`${apiUrl}/api/survey-unit/${id}/data`, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to fetch data of survey-unit (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });

export const putDataSurveyUnitById = (apiUrl, authenticationMode) => (id, data) =>
  new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.put(`${apiUrl}/api/survey-unit/${id}/data`, data, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to put data of survey-unit (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });

export const getCommentSurveyUnitById = (apiUrl, authenticationMode) => id =>
  new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.get(`${apiUrl}/api/survey-unit/${id}/comment`, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to fetch comment of survey-unit (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });

export const putCommentSurveyUnitById = (apiUrl, authenticationMode) => (id, comment) =>
  new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.put(`${apiUrl}/api/survey-unit/${id}/comment`, comment, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to put comment of survey-unit (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });
