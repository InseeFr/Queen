import React, { useState, useEffect, useCallback } from 'react';
import D from 'i18n';
import Preloader from 'components/shared/preloader';
import { ProgressBar } from 'components/shared/ProgressBar';
import { AppVersion, Button } from 'components/designSystem';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import {
  QUEEN_SYNC_RESULT,
  QUEEN_SYNC_RESULT_SUCCESS,
  QUEEN_SYNC_RESULT_FAILURE,
  QUEEN_SYNC_RESULT_PENDING,
  SYNCHRONIZE_KEY,
} from 'utils/constants';
import { useSynchronisation } from 'utils/synchronize';
import { SimpleLabelProgress } from './SimpleLabelProgress';
import { IconStatus } from './IconStatus';

const useStyles = makeStyles(theme => ({
  welcome: { textAlign: 'center', paddingTop: '3em' },
  details: { padding: '3em', paddingTop: '1em' },
  button: { marginTop: theme.spacing(3) },
  icon: { textAlign: 'center', marginTop: '0.5em' },
}));

const Synchronize = () => {
  const classes = useStyles();
  const [toSynchronize] = useState(() => {
    const sync = window.localStorage.getItem(SYNCHRONIZE_KEY);
    return sync === 'true';
  });
  const [pending, setPending] = useState(false);

  const {
    synchronize,
    current,
    waitingMessage,
    sendingProgress,
    campaignProgress,
    resourceProgress,
    surveyUnitProgress,
  } = useSynchronisation();

  const [currentJob, setCurrentJob] = useState(null);

  useEffect(() => {
    if (current) {
      if (current === 'send') setCurrentJob('upload');
      else setCurrentJob('download');
    }
  }, [current]);

  const redirect = () => {
    window.location = window.location.origin;
  };

  const endOfSync = useCallback(
    success => {
      setCurrentJob(success ? 'success' : 'failure');
      window.localStorage.setItem(
        QUEEN_SYNC_RESULT,
        success ? QUEEN_SYNC_RESULT_SUCCESS : QUEEN_SYNC_RESULT_FAILURE
      );
      setTimeout(() => redirect(), 800);
    },
    [setCurrentJob]
  );

  const launchSynchronize = useCallback(async () => {
    try {
      if (navigator.onLine) {
        window.localStorage.setItem(QUEEN_SYNC_RESULT, QUEEN_SYNC_RESULT_PENDING);
        setPending(true);
        await synchronize();
        endOfSync(true);
      } else {
        endOfSync(false);
      }
    } catch (e) {
      console.log('failed');
      console.log(e);
      endOfSync(false);
    }
  }, [endOfSync, synchronize]);

  useEffect(() => {
    if (toSynchronize && !pending) {
      launchSynchronize();
    }
  }, [toSynchronize, pending, launchSynchronize]);

  return (
    <Container>
      {!pending && !toSynchronize && (
        <Box className={classes.welcome}>
          <Typography variant="h3">{D.syncPage}</Typography>
          <Typography>{D.manualSync}</Typography>
          <Button className={classes.button} onClick={launchSynchronize}>
            {D.synchronizeButton}
          </Button>
        </Box>
      )}
      {pending && (
        <>
          <Preloader title={D.syncInProgress} message={waitingMessage} />
          {waitingMessage && (
            <div className={classes.icon}>
              <IconStatus current={currentJob} />
            </div>
          )}
          <Box className={classes.details}>
            {!!sendingProgress && <ProgressBar value={sendingProgress} />}
            {!sendingProgress && campaignProgress !== null && (
              <>
                <SimpleLabelProgress
                  label={D.waitingLoadingCampaigns}
                  value={campaignProgress}
                  current={current === 'questionnaire'}
                />

                {!!resourceProgress && (
                  <SimpleLabelProgress
                    label={D.waitingLoadingResources}
                    value={resourceProgress}
                    current={current === 'resources'}
                  />
                )}
                {!!surveyUnitProgress && (
                  <SimpleLabelProgress
                    label={D.waitingLoadingSU}
                    value={surveyUnitProgress}
                    current={current === 'survey-units'}
                  />
                )}
              </>
            )}
          </Box>
        </>
      )}
      <AppVersion />
    </Container>
  );
};

export default Synchronize;
