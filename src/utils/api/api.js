import { KEYCLOAK, ANONYMOUS, JSON_UTF8_HEADER, QUEEN_USER_KEY } from 'utils/constants';
import { refreshToken, kc, keycloakAuthentication } from 'utils/keycloak';

const getSecureHeader = token => {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const authentication = mode => {
  switch (mode) {
    case KEYCLOAK:
      if (window.localStorage.getItem(QUEEN_USER_KEY)) {
        return refreshToken();
      }
      return keycloakAuthentication({ onLoad: 'login-required' });
    case ANONYMOUS:
      return new Promise(resolve => resolve());
    default:
      return new Promise((resolve, reject) =>
        reject(new Error(`App doesn't support "${mode}" for authentication`))
      );
  }
};

export const getHeader = mode => {
  switch (mode) {
    case KEYCLOAK:
      if (!navigator.onLine) {
        return {
          Accept: JSON_UTF8_HEADER,
        };
      }
      return {
        ...getSecureHeader(kc.token),
        Accept: JSON_UTF8_HEADER,
      };
    default:
      return {
        Accept: JSON_UTF8_HEADER,
      };
  }
};
