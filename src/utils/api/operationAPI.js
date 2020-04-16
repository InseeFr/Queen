import Axios from 'axios';
import { getSecureHeader } from './utils';

export const getOperations = (urlQueenApi, token) => {
  return new Promise((resolve, reject) => {
    Axios.get(`${urlQueenApi}/api/operations`, {
      headers: {
        ...getSecureHeader(token),
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to fetch operations : ${e.message}`)));
  });
};
