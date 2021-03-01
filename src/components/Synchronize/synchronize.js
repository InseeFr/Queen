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

const useStyles = makeStyles(theme => ({
  welcome: { textAlign: 'center', paddingTop: '3em' },
  details: { padding: '3em' },
  button: { marginTop: theme.spacing(3) },
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

  const redirect = () => {
    window.location = window.location.origin;
  };

  const endOfSync = success => {
    const resultKey = success ? QUEEN_SYNC_RESULT_SUCCESS : QUEEN_SYNC_RESULT_FAILURE;
    window.localStorage.setItem(QUEEN_SYNC_RESULT, resultKey);
    setTimeout(() => redirect(), 800);
  };

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
      endOfSync(false);
    }
  }, [synchronize]);

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
