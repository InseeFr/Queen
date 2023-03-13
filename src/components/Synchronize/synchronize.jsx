import React, { useState, useEffect, useCallback } from 'react';
import D from 'i18n';
import Preloader from 'components/shared/preloader';
import { ProgressBar } from 'components/shared/ProgressBar';
import { AppVersion, Button } from 'components/designSystem';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import { QUEEN_SYNC_RESULT, SYNCHRONIZE_KEY } from 'utils/constants';
import { useSynchronisation } from 'utils/synchronize';
import { SimpleLabelProgress } from './SimpleLabelProgress';
import { IconStatus } from './IconStatus';
import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';
import paradataIdbService from 'utils/indexedbb/services/paradata-idb-service';

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
    sendingParadatasProgress,
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

  const getSurveyUnitsSuccess = async (error, questionnairesAccessible = []) => {
    const surveyUnits = await surveyUnitIdbService.getAll();
    if (error === 'send') return surveyUnits.reduce((_, { id }) => [..._, id], []);
    return surveyUnits.reduce((_, { id, questionnaireId }) => {
      if (questionnairesAccessible.includes(questionnaireId)) return [..._, id];
      return _;
    }, []);
  };

  const endOfSync = useCallback(
    async ({
      error,
      surveyUnitsInTempZone = [],
      questionnairesAccessible = [],
      paradataInError = [],
    }) => {
      setCurrentJob(!error ? 'success' : 'failure');
      const result = {
        error: !!error,
        // surveyUnitsSuccess : only surveyUnits in database where there's questionnaire is accessible
        surveyUnitsSuccess: await getSurveyUnitsSuccess(error, questionnairesAccessible),
        surveyUnitsInTempZone,
      };
      paradataIdbService.addAll(paradataInError); // We store in IDB paradatas that failted to be sent
      window.localStorage.setItem(QUEEN_SYNC_RESULT, JSON.stringify(result));
      setTimeout(() => redirect(), 600);
    },
    [setCurrentJob]
  );

  const launchSynchronize = useCallback(async () => {
    if (navigator.onLine) {
      const tempResult = { error: 'pending' };
      window.localStorage.setItem(QUEEN_SYNC_RESULT, JSON.stringify(tempResult));
      setPending(true);
      const result = await synchronize();
      endOfSync(result);
    } else {
      endOfSync({ error: 'send' });
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
            {!!sendingParadatasProgress && <ProgressBar value={sendingParadatasProgress} />}
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
