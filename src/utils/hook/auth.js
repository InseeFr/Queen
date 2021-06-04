import { useContext, useState, useEffect } from 'react';
import { NONE, OIDC } from 'utils/constants';
import { useReactOidc } from '@axa-fr/react-oidc-context';
import { AppContext } from 'components/app';
import { addOnlineStatusObserver } from 'utils';

export const useAuth = () => {
  const { authenticationType } = useContext(AppContext);
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

  if (!online || authenticationType === NONE) return { authenticationType, name: 'Fake User' };

  if (authenticationType === OIDC) {
    /**
     * Assume this conditional hook does not break anything
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { oidcUser, login, logout } = useReactOidc();

    return { authenticationType, oidcUser, login, logout };
  }
  throw new Error(`Auth type ${authenticationType} is nor recognized`);
};
