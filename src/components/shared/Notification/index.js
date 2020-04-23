import React, { useState, useEffect } from 'react';
import D from 'i18n';
import * as serviceWorker from 'utils/serviceWorker/serviceWorker';
import styles from './notification.scss';

const Notification = () => {
  const [message, setMessage] = useState(null);

  const [open, setOpen] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    serviceWorker.register({
      onUpdate: registration => {
        setWaitingServiceWorker(registration.waiting);
        setUpdateAvailable(true);
        setTimeout(() => setOpen(true), 1500);
      },
      onWaiting: waiting => {
        setWaitingServiceWorker(waiting);
        setUpdateAvailable(true);
        setTimeout(() => setOpen(true), 1500);
      },
    });
  }, []);

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
      {isUpdateAvailable && (
        <>
          <style type="text/css">{styles}</style>
          <div className={`notification ${open ? 'visible' : 'hidden'}`}>
            <button type="button" className="close-button" onClick={() => setOpen(false)}>
              {`\u2573 ${D.closeNotif}`}
            </button>
            <div className="title">
              {D.updateAvailable}
              <button type="button" className="update-button" onClick={updateAssets}>
                {D.updateNow}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Notification;
