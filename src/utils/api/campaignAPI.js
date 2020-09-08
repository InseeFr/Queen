import Axios from 'axios';
import { authentication, getHeader } from './api';

export const getCampaigns = (apiUrl, authenticationMode) => {
  return new Promise((resolve, reject) => {
    authentication(authenticationMode)
      .then(() => {
        Axios.get(`${apiUrl}/api/campaigns`, {
          headers: getHeader(authenticationMode),
        })
          .then(res => resolve(res))
          .catch(e => reject(new Error(`Failed to fetch campaigns : ${e.message}`)));
      })
      .catch(e => reject(new Error(`Error during refreshToken : ${e.message}`)));
  });
};
