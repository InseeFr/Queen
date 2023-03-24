import { NONE, OIDC } from 'utils/constants';

import { AppContext } from 'components/app';
import { useContext } from 'react';
import { useReactOidc } from '@axa-fr/react-oidc-context';

export const useAuth = () => {
  const { authenticationType, online } = useContext(AppContext);
  if (!online || authenticationType === NONE) return { authenticationType, name: 'Fake User' };

  if (authenticationType === OIDC) {
    /**
     * Assume this conditional hook does not break anything
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { oidcUser } = useReactOidc();
    return { authenticationType, oidcUser };
  }
  throw new Error(`Auth type ${authenticationType} is nor recognized`);
};
