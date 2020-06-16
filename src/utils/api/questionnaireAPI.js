import Axios from 'axios';
import { authentication, getHeader } from './api';

export const getQuestionnaireById = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => id => {
  return new Promise((resolve, reject) => {
    authentication(QUEEN_AUTHENTICATION_MODE)
      .then(() => {
        Axios.get(`${QUEEN_API_URL}/api/operation/${id}/questionnaire`, {
          headers: getHeader(QUEEN_AUTHENTICATION_MODE),
        })
          .then(res => resolve(res))
          .catch(e => reject(new Error(`Failed to fetch questionnaire (id:${id}): ${e.message}`)));
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });
};
