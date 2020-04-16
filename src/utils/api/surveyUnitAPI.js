import Axios from 'axios';
import { getSecureHeader } from './utils';
import data from '../fake-survey/data.json';

export const getSurveyUnitByIdOperation = (urlQueenApi, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${urlQueenApi}/api/operation/${id}/reporting-units`, {
      headers: {
        ...getSecureHeader(token),
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e =>
        reject(new Error(`Failed to fetch survey-units of operation (id:${id}) : ${e.message}`))
      );
  });

export const getDataSurveyUnitById = (urlQueenApi, token) => id =>
  new Promise((resolve, reject) => {
    // Axios.get(`${urlQueenApi}/api/reporting-unit/${id}/data`, {
    //   headers: {
    //     ...getSecureHeader(token),
    //     Accept: 'application/json;charset=utf-8',
    //   },
    // })
    //   .then(res => resolve(res))
    //   .catch(e =>
    //     reject(new Error(`Failed to fetch data of survey-unit (id:${id}) : ${e.message}`))
    //   );

    setTimeout(() => resolve({ data }), 1000);
  });

export const getCommentSurveyUnitById = (urlQueenApi, token) => id =>
  new Promise((resolve, reject) => {
    // Axios.get(`${urlQueenApi}/api/reporting-unit/${id}/comment`, {
    //   headers: {
    //     ...getSecureHeader(token),
    //     Accept: 'application/json;charset=utf-8',
    //   },
    // })
    //   .then(res => resolve(res))
    //   .catch(e =>
    //     reject(new Error(`Failed to fetch data of survey-unit (id:${id}) : ${e.message}`))
    //   );

    setTimeout(() => resolve({ data: {} }), 500);
  });
