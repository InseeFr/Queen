import React, { useState } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import { StyleWrapper } from './notification.style';

const Notification = ({ serviceWorkerInfo }) => {
  const [open, setOpen] = useState(true);

  const {
    isUpdating,
    isUpdateInstalled,
    isInstallingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
    isInstallationFailed,
    updateApp,
    clearUpdating,
  } = serviceWorkerInfo;

  const getMessage = () => {
    if (isUpdating) return D.updating;
    if (isUpdateInstalled) return D.updateInstalled;
    if (isUpdateAvailable) return D.updateAvailable;
    if (isServiceWorkerInstalled) return D.appReadyOffline;
    if (isInstallingServiceWorker) return D.appInstalling;
    if (isInstallationFailed) return D.installError;
    return null;
  };

  const close = () => {
    if (isUpdateInstalled) clearUpdating();
    setOpen(false);
  };

  return (
    <StyleWrapper
      className={`notification ${isUpdateAvailable && 'update'} ${
        getMessage() && open ? 'visible' : ''
      } ${isInstallationFailed && 'error'} ${(isServiceWorkerInstalled || isUpdateInstalled) &&
        'success'}`}
    >
      {open && (
        <>
          <button type="button" className="close-button" onClick={close}>
            {`\u2573 ${D.closeNotif}`}
          </button>
          <div className="title">{getMessage()}</div>
          {isUpdateAvailable && !isUpdating && (
            <button type="button" className="update-button" onClick={updateApp}>
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
    isUpdating: PropTypes.bool.isRequired,
    isUpdateInstalled: PropTypes.bool,
    isInstallingServiceWorker: PropTypes.bool.isRequired,
    isUpdateAvailable: PropTypes.bool.isRequired,
    isServiceWorkerInstalled: PropTypes.bool.isRequired,
    isInstallationFailed: PropTypes.bool.isRequired,
    updateApp: PropTypes.func.isRequired,
    clearUpdating: PropTypes.func.isRequired,
  }).isRequired,
};
