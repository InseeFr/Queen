import Keycloak from 'keycloak-js';
import { QUEEN_URL } from 'utils/constants';

export const kc = Keycloak(`${QUEEN_URL}/keycloak.json`);

export const keycloakAuthentication = params =>
  new Promise((resolve, reject) => {
    if (navigator.onLine) {
      console.log('init keycloak');
      kc.init(params)
        .then(authenticated => {
          resolve(authenticated);
        })
        .catch(e => reject(e));
    } else {
      resolve();
    }
  });

export const refreshToken = (minValidity = 5) => {
  return new Promise((resolve, reject) => {
    kc.updateToken(minValidity)
      .then(() => resolve())
      .catch(error => reject(error));
  });
};

export const getTokenInfo = () => {
  const name = (kc && kc.tokenParsed && kc.tokenParsed.family_name) || '';
  const firstName = (kc && kc.tokenParsed && kc.tokenParsed.given_name) || '';
  const id = (kc && kc.tokenParsed && kc.tokenParsed.preferred_username) || '';
  const roles =
    (kc && kc.tokenParsed && kc.tokenParsed.realm_access && kc.tokenParsed.realm_access.roles) ||
    [];
  return { id, name, firstName, roles };
};
