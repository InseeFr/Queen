import React, { useState, useEffect, useContext } from 'react';
import D from 'i18n';
// eslint-disable-next-line import/no-unresolved
import { AuthenticationProvider, InMemoryWebStorage } from '@axa-fr/react-oidc-context';
import Loader from 'components/shared/preloader';
import { buildOidcConfiguration } from 'utils/oidc/build-configuration';
import { AppContext } from 'components/app';
import Error from 'components/shared/Error';
import { QUEEN_URL } from 'utils/constants';

const AuthProviderOIDC = ({ children }) => {
  const conf = useContext(AppContext);
  const [oidcConf, setOidcConf] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${QUEEN_URL}/oidc.json`)
      .then(r => r.json())
      .then(r => {
        setOidcConf(r);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;
  return (
    <AuthenticationProvider
      configuration={buildOidcConfiguration({
        oidcConf: oidcConf.config,
        conf,
      })}
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
