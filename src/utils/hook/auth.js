import { useContext } from 'react';
import { NONE, OIDC } from 'utils/constants';
/* pb with this import */
// eslint-disable-next-line import/no-unresolved
import { useReactOidc } from '@axa-fr/react-oidc-context';
import { AppContext } from 'components/app';

export const useAuth = () => {
  const { authenticationType } = useContext(AppContext);
  if (authenticationType === NONE) return { authenticationType, name: 'Fake User' };
  if (authenticationType === OIDC) {
    /**
     * Assume this conditional hook does not break anything
     */
    const { oidcUser, login, logout } = useReactOidc();
    return { authenticationType, oidcUser, login, logout };
  }
  throw new Error(`Auth type ${authenticationType} is nor recognized`);
};
