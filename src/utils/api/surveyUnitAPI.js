import Axios from 'axios';
import { authentication, getHeader } from './api';
// import data from '../fake-survey/data.json';

export const getSurveyUnitByIdOperation = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => id =>
  new Promise((resolve, reject) => {
    authentication(QUEEN_AUTHENTICATION_MODE)
      .then(() => {
        Axios.get(`${QUEEN_API_URL}/api/operation/${id}/reporting-units`, {
          headers: getHeader(QUEEN_AUTHENTICATION_MODE),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to fetch survey-units of operation (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });

export const getDataSurveyUnitById = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => id =>
  new Promise((resolve, reject) => {
    authentication(QUEEN_AUTHENTICATION_MODE)
      .then(() => {
        Axios.get(`${QUEEN_API_URL}/api/reporting-unit/${id}/data`, {
          headers: getHeader(QUEEN_AUTHENTICATION_MODE),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to fetch data of survey-unit (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });

export const putDataSurveyUnitById = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => (id, data) =>
  new Promise((resolve, reject) => {
    authentication(QUEEN_AUTHENTICATION_MODE)
      .then(() => {
        Axios.put(`${QUEEN_API_URL}/api/reporting-unit/${id}/data`, data, {
          headers: getHeader(QUEEN_AUTHENTICATION_MODE),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to put data of survey-unit (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });

export const getCommentSurveyUnitById = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => id =>
  new Promise((resolve, reject) => {
    authentication(QUEEN_AUTHENTICATION_MODE)
      .then(() => {
        Axios.get(`${QUEEN_API_URL}/api/reporting-unit/${id}/comment`, {
          headers: getHeader(QUEEN_AUTHENTICATION_MODE),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to fetch comment of survey-unit (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });

export const putCommentSurveyUnitById = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => (
  id,
  comment
) =>
  new Promise((resolve, reject) => {
    authentication(QUEEN_AUTHENTICATION_MODE)
      .then(() => {
        Axios.put(`${QUEEN_API_URL}/api/reporting-unit/${id}/comment`, comment, {
          headers: getHeader(QUEEN_AUTHENTICATION_MODE),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(new Error(`Failed to put comment of survey-unit (id:${id}) : ${e.message}`))
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });
