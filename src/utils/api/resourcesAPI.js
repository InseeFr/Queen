import Axios from 'axios';
import { authentication, getHeader } from './api';

export const getListRequiredNomenclature = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => id =>
  new Promise((resolve, reject) => {
    authentication(QUEEN_AUTHENTICATION_MODE)
      .then(() => {
        Axios.get(`${QUEEN_API_URL}/api/operation/${id}/required-nomenclatures`, {
          headers: getHeader(QUEEN_AUTHENTICATION_MODE),
        })
          .then(res => resolve(res))
          .catch(e =>
            reject(
              new Error(
                `Failed to fetch required-nomenclatures of operation (id:${id}) : ${e.message}`
              )
            )
          );
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });

export const getNomenclatureById = (QUEEN_API_URL, QUEEN_AUTHENTICATION_MODE) => id =>
  new Promise((resolve, reject) => {
    authentication(QUEEN_AUTHENTICATION_MODE)
      .then(() => {
        Axios.get(`${QUEEN_API_URL}/api/nomenclature/${id}`, {
          headers: getHeader(QUEEN_AUTHENTICATION_MODE),
        })
          .then(res => resolve(res))
          .catch(e => reject(new Error(`Failed to fetch nomenclature (id:${id}) : ${e.message}`)));
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });
