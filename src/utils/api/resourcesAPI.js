import Axios from 'axios';
import { getSecureHeader } from './utils';

export const getListRequiredNomenclature = (QUEEN_API_URL, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${QUEEN_API_URL}/api/operation/${id}/required-nomenclatures`, {
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

export const getNomenclatureById = (QUEEN_API_URL, token) => id =>
  new Promise((resolve, reject) => {
    Axios.get(`${QUEEN_API_URL}/api/nomenclature/${id}`, {
      headers: {
        ...getSecureHeader(token),
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e => reject(new Error(`Failed to fetch nomenclature (id:${id}) : ${e.message}`)));
  });
