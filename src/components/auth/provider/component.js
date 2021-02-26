import React, { useEffect, useState } from 'react';
import { addOnlineStatusObserver } from 'utils';
import { NONE, OIDC } from 'utils/constants';
import AuthProviderNone from './none';
import AuthProviderOIDC from './oidc';

const AuthProvider = ({ authType, children }) => {
  const [init, setInit] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    if (!init) {
      addOnlineStatusObserver(s => {
        setOnline(s);
      });
      setInit(true);
    }
  }, [init]);

  if (!online || authType === NONE) return <AuthProviderNone>{children}</AuthProviderNone>;
  if (authType === OIDC) return <AuthProviderOIDC>{children}</AuthProviderOIDC>;
  return <div>{`Auth type ${authType} is not recognized`}</div>;
};

export default AuthProvider;
