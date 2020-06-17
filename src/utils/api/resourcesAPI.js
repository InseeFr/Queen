import Axios from 'axios';
import { authentication, getHeader } from './api';

export const getListRequiredNomenclature = (apiUrl, authenticationMode) => id =>
  new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.get(`${apiUrl}/api/operation/${id}/required-nomenclatures`, {
          headers: getHeader(authenticationMode),
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

export const getNomenclatureById = (apiUrl, authenticationMode) => id =>
  new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.get(`${apiUrl}/api/nomenclature/${id}`, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e => reject(new Error(`Failed to fetch nomenclature (id:${id}) : ${e.message}`)));
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });
