import Axios from 'axios';
import { authentication, getHeader } from './api';

export const getQuestionnaireById = (apiUrl, authenticationMode) => id => {
  return new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.get(`${apiUrl}/api/campaign/${id}/questionnaire`, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e => reject(new Error(`Failed to fetch questionnaire (id:${id}): ${e.message}`)));
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });
};

export const getQuestionnaireByUrl = url => {
  return new Promise((resolve, reject) => {
    Axios.get(`${url}`)
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to fetch questionnaire (${url}): ${e.message}`)));
  });
};
