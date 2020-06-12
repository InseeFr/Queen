import Axios from 'axios';
import { getSecureHeader } from './utils';
import { JSON_UTF8_HEADER, KEYCLOAK, ANONYMOUS } from 'utils/constants';
import { kc, refreshToken } from 'keycloak';

const authentication = mode => {
  switch (mode) {
    case KEYCLOAK:
      return refreshToken();
      break;
    case ANONYMOUS:
      return new Promise((resolve, reject) => resolve('GUEST'));
      break;
  }
};

export const getQuestionnaireById = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => id =>
  new Promise((resolve, reject) => {
    authentication(QUEEN_AUTHENTICATION_MODE).then(() => {
      Axios.get(`${QUEEN_API_URL}/api/operation/${id}/questionnaire`, {
        headers: {
          ...getSecureHeader(kc.token),
          Accept: JSON_UTF8_HEADER,
        },
      })
        .then(res => resolve(res))
        .catch(e => reject(new Error(`Failed to fetch questionnaire (id:${id}): ${e.message}`)));
    });
  });
