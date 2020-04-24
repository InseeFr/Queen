import React, { useState, useEffect } from 'react';
import D from 'i18n';
import * as serviceWorker from 'utils/serviceWorker/serviceWorker';
import styles from './notification.scss';

const Notification = ({ standalone }) => {
  const [init, setInit] = useState(false);
  const [open, setOpen] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const [isServiceWorkerInstalled, setServiceWorkerInstalled] = useState(false);

  useEffect(() => {
    if (!init && standalone) {
      serviceWorker.register({
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

  return (
    <>
      <style type="text/css">{styles}</style>
      <div
        className={`notification ${
          (isUpdateAvailable || isServiceWorkerInstalled) && open ? 'visible' : ''
        }`}
      >
        <>
          <button type="button" className="close-button" onClick={() => setOpen(false)}>
            {`\u2573 ${D.closeNotif}`}
          </button>
          {isUpdateAvailable && (
            <>
              <div className="title">{D.updateAvailable}</div>
              <button type="button" className="update-button" onClick={updateAssets}>
                {D.updateNow}
              </button>
            </>
          )}
          {!isUpdateAvailable && isServiceWorkerInstalled && (
            <div className="title">{D.appReadyOffline}</div>
          )}
        </>
      </div>
    </>
  );
};

export default Notification;
