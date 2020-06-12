import Axios from 'axios';
import { getSecureHeader } from './utils';
import { JSON_UTF8_HEADER } from 'utils/constants';
// import data from '../fake-survey/data.json';

export const getSurveyUnitByIdOperation = (QUEEN_API_URL, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${QUEEN_API_URL}/api/operation/${id}/reporting-units`, {
      headers: {
        ...getSecureHeader(token),
        Accept: JSON_UTF8_HEADER,
      },
    })
      .then(res => resolve(res))
      .catch(e =>
        reject(new Error(`Failed to fetch survey-units of operation (id:${id}) : ${e.message}`))
      );
  });

export const getDataSurveyUnitById = (QUEEN_API_URL, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${QUEEN_API_URL}/api/reporting-unit/${id}/data`, {
      headers: {
        ...getSecureHeader(token),
        Accept: JSON_UTF8_HEADER,
      },
    })
      .then(res => resolve(res))
      .catch(e =>
        reject(new Error(`Failed to fetch data of survey-unit (id:${id}) : ${e.message}`))
      );
  });

export const putDataSurveyUnitById = (QUEEN_API_URL, token) => (id, data) =>
  new Promise((resolve, reject) => {
    Axios.put(`${QUEEN_API_URL}/api/reporting-unit/${id}/data`, data, {
      headers: {
        ...getSecureHeader(token),
        Accept: JSON_UTF8_HEADER,
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to put data of survey-unit (id:${id}) : ${e.message}`)));
  });

export const getCommentSurveyUnitById = (QUEEN_API_URL, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${QUEEN_API_URL}/api/reporting-unit/${id}/comment`, {
      headers: {
        ...getSecureHeader(token),
        Accept: JSON_UTF8_HEADER,
      },
    })
      .then(res => resolve(res))
      .catch(e =>
        reject(new Error(`Failed to fetch comment of survey-unit (id:${id}) : ${e.message}`))
      );
  });

export const putCommentSurveyUnitById = (QUEEN_API_URL, token) => (id, comment) =>
  new Promise((resolve, reject) => {
    Axios.put(`${QUEEN_API_URL}/api/reporting-unit/${id}/comment`, comment, {
      headers: {
        ...getSecureHeader(token),
        Accept: JSON_UTF8_HEADER,
      },
    })
      .then(res => resolve(res))
      .catch(e =>
        reject(new Error(`Failed to put comment of survey-unit (id:${id}) : ${e.message}`))
      );
  });
