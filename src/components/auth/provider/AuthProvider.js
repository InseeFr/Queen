import { AppContext } from 'components/app';
import React, { useContext } from 'react';
import { NONE, OIDC } from 'utils/constants';
import AuthProviderNone from './AuthProviderNone';
import AuthProviderOIDC from './AuthProviderOIDC';

const AuthProvider = ({ authType, children }) => {
  const { online } = useContext(AppContext);

  if (!online || authType === NONE) return <AuthProviderNone>{children}</AuthProviderNone>;
  if (authType === OIDC) return <AuthProviderOIDC>{children}</AuthProviderOIDC>;
  return <div>{`Auth type ${authType} is not recognized`}</div>;
};

export default AuthProvider;
