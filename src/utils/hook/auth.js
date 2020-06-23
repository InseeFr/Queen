import { useState, useEffect } from 'react';
import { QUEEN_USER_KEY, GUEST_QUEEN_USER, KEYCLOAK, ANONYMOUS } from 'utils/constants';
import { keycloakAuthentication, getTokenInfo } from 'utils/keycloak';

const interviewerRoles = [
  'queen-interviewer',
  'Testeur_agent-insee-interne-test_Keycloak',
  'Guest',
];
const administratorRoles = ['Queen_Administrator'];

const isAuthorized = roles =>
  roles.filter(r => interviewerRoles.includes(r) || administratorRoles.includes(r)).length > 0;

const isLocalStorageTokenValid = () => {
  const interviewer = JSON.parse(window.localStorage.getItem(QUEEN_USER_KEY));
  if (interviewer && interviewer.roles) {
    const { roles } = interviewer;
    if (isAuthorized(roles)) {
      return true;
    }
  }
  return false;
};

export const useAuth = authenticationMode => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const accessAuthorized = () => {
    setLoading(false);
    setAuthenticated(true);
  };

  const accessDenied = () => {
    setLoading(false);
    setAuthenticated(false);
  };

  useEffect(() => {
    switch (authenticationMode) {
      case KEYCLOAK:
        keycloakAuthentication({ onLoad: 'login-required', checkLoginIframe: false })
          .then(auth => {
            if (auth) {
              const interviewerInfos = getTokenInfo();
              const { roles } = interviewerInfos;
              if (isAuthorized(roles)) {
                window.localStorage.setItem(QUEEN_USER_KEY, JSON.stringify(interviewerInfos));
                accessAuthorized();
              } else {
                // Authentifié mais n'a pas les bons droits
                accessDenied();
              }
              // offline mode
            } else if (isLocalStorageTokenValid()) {
              accessAuthorized();
            } else {
              accessDenied();
            }
          })
          .catch(() => (isLocalStorageTokenValid() ? accessAuthorized() : accessDenied()));
        break;
      case ANONYMOUS:
        window.localStorage.setItem(QUEEN_USER_KEY, GUEST_QUEEN_USER);
        accessAuthorized();
        break;
      default:
        break;
    }
  }, [authenticationMode]);
  return { authenticated, loading };
};
