import React, { useState } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import { useServiceWorker } from 'utils/hook';
import { StyleWrapper } from './notification.style';

const ServiceWorkerNotification = ({ standalone }) => {
  const {
    isUpdating,
    isUpdateInstalled,
    isInstallingServiceWorker,
    isUpdateAvailable,
    isServiceWorkerInstalled,
    isInstallationFailed,
    updateApp,
    clearUpdating,
  } = useServiceWorker({
    standalone,
  });

  const [open, setOpen] = useState(true);

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
    setOpen(false);
    if (isUpdateInstalled) setTimeout(() => clearUpdating(), 1000);
  };

  return (
    standalone && (
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
    )
  );
};

export default ServiceWorkerNotification;

ServiceWorkerNotification.propTypes = {
  standalone: PropTypes.bool.isRequired,
};
