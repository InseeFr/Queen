import Axios from 'axios';
import { getSecureHeader } from './utils';
import { JSON_UTF8_HEADER } from 'utils/constants';
// import simpsons from '../fake-survey/simpsons copy.json';

export const getQuestionnaireById = (QUEEN_API_URL, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${QUEEN_API_URL}/api/operation/${id}/questionnaire`, {
      headers: {
        ...getSecureHeader(token),
        Accept: JSON_UTF8_HEADER,
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to fetch questionnaire (id:${id}): ${e.message}`)));
  });
