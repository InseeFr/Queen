import Keycloak from 'keycloak-js';
import { QUEEN_URL } from 'utils/constants';

const kcConfig = `${QUEEN_URL}/keycloak.json`;
export const kc = Keycloak(kcConfig);

export const refreshToken = (minValidity = 5) => {
  return new Promise((resolve, reject) => {
    kc.updateToken(minValidity)
      .success(() => resolve())
      .error(error => reject(error));
  });
};
