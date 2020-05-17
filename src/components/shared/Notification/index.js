import React, { useState, useEffect } from 'react';
import D from 'i18n';
import * as serviceWorker from 'utils/serviceWorker/serviceWorker';
import { StyleWrapper } from './notification.style';

const Notification = ({ standalone }) => {
  const [init, setInit] = useState(false);
  const [open, setOpen] = useState(false);
  const [installingServiceWorker, setInstallingServiceWorker] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);

  useEffect(() => {
    if (!init && standalone) {
      serviceWorker.register({
        onInstalling: installing => {
          setInstallingServiceWorker(installing);
          setOpen(true);
        },
        onUpdate: registration => {
          setWaitingServiceWorker(registration.waiting);
          setUpdateAvailable(true);
          setOpen(true);
        },
        onWaiting: waiting => {
          setWaitingServiceWorker(waiting);
          setUpdateAvailable(true);
          setOpen(true);
        },
        onSuccess: registration => {
          setInstallingServiceWorker(false);
          setServiceWorkerInstalled(!!registration);
          setOpen(true);
        },
      });
      setInit(true);
    }
  }, [init]);

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

  const getMessage = () => {
    if (isUpdateAvailable) return D.updateAvailable;
    if (isServiceWorkerInstalled) return D.appReadyOffline;
    if (installingServiceWorker) return D.appInstalling;
    return '';
  };

  return (
    <StyleWrapper
      className={`${isUpdateAvailable ? 'update' : ''} ${
        (isUpdateAvailable || isServiceWorkerInstalled || installingServiceWorker) && open
          ? 'visible'
          : ''
      }`}
    >
      {open && (
        <>
          <button type="button" className="close-button" onClick={() => setOpen(false)}>
            {`\u2573 ${D.closeNotif}`}
          </button>
          <div className="title">{getMessage()}</div>
          {isUpdateAvailable && (
            <button type="button" className="update-button" onClick={updateAssets}>
              {D.updateNow}
            </button>
          )}
        </>
      )}
    </StyleWrapper>
  );
};

export default Notification;
