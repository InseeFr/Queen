import Axios from 'axios';
import { getSecureHeader } from './utils';
import { JSON_UTF8_HEADER } from 'utils/constants';

export const getOperations = (QUEEN_API_URL, token) => {
  return new Promise((resolve, reject) => {
    Axios.get(`${QUEEN_API_URL}/api/operations`, {
      headers: {
        ...getSecureHeader(token),
        Accept: JSON_UTF8_HEADER,
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to fetch operations : ${e.message}`)));
  });
};
