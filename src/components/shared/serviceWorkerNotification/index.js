import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import { useServiceWorker } from 'utils/hook';
import { Box, makeStyles, Slide, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Button } from 'components/designSystem';

const SlideTransition = props => <Slide {...props} direction="down" />;

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    minWidth: '80%',
  },
  buttonParrent: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const ServiceWorkerNotification = ({ standalone }) => {
  const classes = useStyles();
  const [message, setMessage] = useState(null);
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

  const [open, setOpen] = useState(false);
  const [severityType, setSeverityType] = useState('info');

  useEffect(() => {
    if (message) setOpen(true);
  }, [message]);

  useEffect(() => {
    if (isUpdating || isInstallingServiceWorker || isUpdateAvailable) setSeverityType('info');
    if (isInstallationFailed) setSeverityType('error');
    if (isUpdateInstalled || isServiceWorkerInstalled) setSeverityType('success');
  }, [
    isUpdating,
    isInstallingServiceWorker,
    isUpdateAvailable,
    isInstallationFailed,
    isUpdateInstalled,
    isServiceWorkerInstalled,
  ]);

  useEffect(() => {
    if (isUpdating) setMessage(D.updating);
    else if (isUpdateInstalled) setMessage(D.updateInstalled);
    else if (isUpdateAvailable) setMessage(D.updateAvailable);
    else if (isServiceWorkerInstalled) setMessage(D.appReadyOffline);
    else if (isInstallingServiceWorker) setMessage(D.appInstalling);
    else if (isInstallationFailed) setMessage(D.installError);
    else setMessage(null);
  }, [
    isUpdating,
    isInstallingServiceWorker,
    isUpdateAvailable,
    isInstallationFailed,
    isUpdateInstalled,
    isServiceWorkerInstalled,
  ]);

  const close = () => {
    setOpen(false);
    if (isUpdateInstalled) setTimeout(() => clearUpdating(), 1000);
  };

  return (
    standalone && (
      <Snackbar
        open={open}
        onClose={close}
        className={classes.root}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={close}
          severity={severityType}
          className={classes.root}
        >
          {message}
          {isUpdateAvailable && !isUpdating && (
            <Box className={classes.buttonParrent}>
              <Button onClick={updateApp}>{D.updateNow}</Button>
            </Box>
          )}
        </Alert>
      </Snackbar>
    )
  );
};

export default ServiceWorkerNotification;

ServiceWorkerNotification.propTypes = {
  standalone: PropTypes.bool.isRequired,
};
