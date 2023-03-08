import { NONE, OIDC } from 'utils/constants';
import { useCallback, useContext, useRef } from 'react';

import { AppContext } from 'components/app';
import { useReactOidc } from '@axa-fr/react-oidc-context';

export const useAuth = () => {
  const { authenticationType, online } = useContext(AppContext);
  const oidcUserRef = useRef();
  const getOidcUser = useCallback(() => oidcUserRef?.current, []);
  if (!online || authenticationType === NONE) return { authenticationType, name: 'Fake User' };

  if (authenticationType === OIDC) {
    /**
     * Assume this conditional hook does not break anything
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { oidcUser, login, logout } = useReactOidc();
    oidcUserRef.current = oidcUser;
    return { authenticationType, getOidcUser, login, logout, oidcUser };
  }
  throw new Error(`Auth type ${authenticationType} is nor recognized`);
};
