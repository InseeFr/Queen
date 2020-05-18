import Axios from 'axios';
import { getSecureHeader } from './utils';
// import simpsons from '../fake-survey/simpsons copy.json';

export const getQuestionnaireById = (QUEEN_API_URL, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${QUEEN_API_URL}/api/operation/${id}/questionnaire`, {
      headers: {
        ...getSecureHeader(token),
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to fetch questionnaire (id:${id}): ${e.message}`)));
  });
