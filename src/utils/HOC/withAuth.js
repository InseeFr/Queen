import React from 'react';
import Preloader from 'components/shared/preloader';
import { kc } from 'keycloak';
import { QUEEN_INTERVIEWER_KEY } from 'utils/constants';

const interviewerRoles = ['queen-interviewer', 'Testeur_agent-insee-interne-test_Keycloak'];

const administratorRoles = ['Queen_Administrator'];

const authentification = new Promise((resolve, reject) => {
  if (navigator.onLine) {
    kc.init({ onLoad: 'login-required', checkLoginIframe: false })
      .success(authenticated => {
        resolve(authenticated);
      })
      .error(e => reject(e));
  } else {
    resolve();
  }
});

const unauthorized = <h3>Vous n'êtes pas autorisé !</h3>;

const authenticationInProgress = <Preloader message="Authentification en cours" />;

const isAuthorized = roles =>
  roles.filter(r => interviewerRoles.includes(r) || administratorRoles.includes(r)).length > 0;

const isLocalStorageTokenValid = () => {
  const token = JSON.parse(localStorage.getItem(QUEEN_INTERVIEWER_KEY));
  if (token && token.roles) {
    const { roles } = token;
    if (isAuthorized(roles)) {
      return true;
    }
  }
  return false;
};

export default WrappedComponent =>
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { authenticated: false, isLoading: true };
    }

    componentDidMount() {
      authentification
        .then(authenticated => {
          if (authenticated) {
            const { roles } = kc.tokenParsed.realm_access;
            console.log('roles');
            console.log(roles);
            if (isAuthorized(roles)) {
              const interviewerStorage = kc.tokenParsed;
              localStorage.setItem(
                QUEEN_INTERVIEWER_KEY,
                JSON.stringify({
                  nom: interviewerStorage.family_name,
                  prenom: interviewerStorage.given_name,
                  idep: interviewerStorage.preferred_username,
                  roles,
                })
              );
              this.accessAuthorized();
            } else {
              // Authentifié mais n'a pas les bons droits
              this.accessDenied();
            }
            // offline mode
          } else if (isLocalStorageTokenValid()) {
            this.accessAuthorized();
          } else {
            this.accessDenied();
          }
        })
        .catch(() => (isLocalStorageTokenValid() ? this.accessAuthorized() : this.accessDenied()));
    }

    accessDenied() {
      this.setState({ isLoading: false, authenticated: false });
    }

    accessAuthorized() {
      this.setState({ isLoading: false, authenticated: true });
    }

    render() {
      const { authenticated, isLoading } = this.state;
      if (isLoading) {
        return authenticationInProgress;
      }
      return authenticated ? <WrappedComponent /> : unauthorized;
    }
  };
