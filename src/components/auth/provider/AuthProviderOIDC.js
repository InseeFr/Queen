import React, { useState, useEffect, useContext } from 'react';
import D from 'i18n';
import { AuthenticationProvider, InMemoryWebStorage } from '@axa-fr/react-oidc-context';
import Loader from 'components/shared/preloader';
import {
  buildOidcConfiguration,
  buildOidcConfigurationFromKeycloak,
} from 'utils/oidc/build-configuration';
import { AppContext } from 'components/app';
import Error from 'components/shared/Error';
import { QUEEN_URL } from 'utils/constants';

const AuthProviderOIDC = ({ children }) => {
  const conf = useContext(AppContext);
  const [oidcConf, setOidcConf] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${QUEEN_URL}/keycloak.json`)
      .then(r => r.json())
      .then(r => {
        setOidcConf(
          buildOidcConfigurationFromKeycloak({
            keycloakConf: r,
          })
        );
        setLoading(false);
      })
      .catch(() => {
        fetch(`${QUEEN_URL}/oidc.json`)
          .then(r => r.json())
          .then(r => {
            setOidcConf(
              buildOidcConfiguration({
                oidcConf: r.config,
              })
            );
            setLoading(false);
          })
          .catch(() => {
            setError(true);
            setLoading(false);
          });
      });
  }, [conf]);

  if (loading) return <Loader />;
  if (error) return <Error message={D.noAuthFile} />;
  return (
    <AuthenticationProvider
      configuration={oidcConf}
      isEnabled={oidcConf.isEnabled}
      UserStore={InMemoryWebStorage}
      callbackComponentOverride={() => <Loader />}
      authenticating={() => <Loader />}
      notAuthorized={() => <Error message={D.unauthorized} />}
      sessionLostComponent={() => <Loader />}
    >
      {children}
    </AuthenticationProvider>
  );
};

export default AuthProviderOIDC;
