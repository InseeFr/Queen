import React, { useState } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import { StyleWrapper } from './notification.style';

const Notification = ({ serviceWorkerInfo }) => {
  const [open, setOpen] = useState(true);

  const {
    installingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
    updateAssets,
  } = serviceWorkerInfo;

  const getMessage = () => {
    if (isUpdateAvailable) return D.updateAvailable;
    if (isServiceWorkerInstalled) return D.appReadyOffline;
    if (installingServiceWorker) return D.appInstalling;
    return '';
  };

  return (
    <StyleWrapper
      className={`notification ${isUpdateAvailable ? 'update' : ''} ${
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
Notification.propTypes = {
  serviceWorkerInfo: PropTypes.shape({
    installingServiceWorker: PropTypes.any.isRequired,
    waitingServiceWorker: PropTypes.any.isRequired,
    isUpdateAvailable: PropTypes.any.isRequired,
    isServiceWorkerInstalled: PropTypes.any.isRequired,
    updateAssets: PropTypes.func.isRequired,
  }).isRequired,
};
