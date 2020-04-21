import Axios from 'axios';
import { getSecureHeader } from './utils';

export const getListRequiredNomenclature = (urlQueenApi, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${urlQueenApi}/api/operation/${id}/required-nomenclatures`, {
      headers: {
        ...getSecureHeader(token),
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e =>
        reject(
          new Error(`Failed to fetch required-nomenclatures of operation (id:${id}) : ${e.message}`)
        )
      );
  });

export const getNomenclatureById = (urlQueenApi, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${urlQueenApi}/api/nomenclature/${id}`, {
      headers: {
        ...getSecureHeader(token),
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to fetch nomenclature (id:${id}) : ${e.message}`)));
  });
