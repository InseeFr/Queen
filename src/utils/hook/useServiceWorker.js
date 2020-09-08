import { useState, useEffect } from 'react';
import * as serviceWorker from 'utils/serviceWorker/serviceWorker';

const useServiceWorker = ({ authenticated, standalone }) => {
  const [installingServiceWorker, setInstallingServiceWorker] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);

  useEffect(() => {
    if (authenticated && standalone) {
      serviceWorker.register({
        onInstalling: installing => {
          setInstallingServiceWorker(installing);
        },
        onUpdate: registration => {
          setWaitingServiceWorker(registration.waiting);
          setUpdateAvailable(true);
        },
        onWaiting: waiting => {
          setWaitingServiceWorker(waiting);
          setUpdateAvailable(true);
        },
        onSuccess: registration => {
          setInstallingServiceWorker(false);
          setServiceWorkerInstalled(!!registration);
        },
      });
    }
  }, [authenticated, standalone]);

  const updateAssets = () => {
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  useEffect(() => {
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', event => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }, [waitingServiceWorker]);

  return {
    installingServiceWorker,
    waitingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
    updateAssets,
  };
};
export default useServiceWorker;
