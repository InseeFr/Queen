import React, { useState, useEffect, useCallback } from 'react';
import D from 'i18n';
import ProgressBar from 'components/shared/ProgressBar';
import Preloader from 'components/shared/preloader';
import {
  QUEEN_SYNC_RESULT,
  QUEEN_SYNC_RESULT_SUCCESS,
  QUEEN_SYNC_RESULT_FAILURE,
  QUEEN_SYNC_RESULT_PENDING,
  SYNCHRONIZE_KEY,
} from 'utils/constants';
import { useSynchronisation } from 'utils/synchronize';
import { StyleWrapper } from './synchronize.style';
import { version } from '../../../package.json';

const Synchronize = () => {
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

  const launchSynchronize = useCallback(async () => {
    try {
      if (navigator.onLine) {
        window.localStorage.setItem(QUEEN_SYNC_RESULT, QUEEN_SYNC_RESULT_PENDING);
        setPending(true);
        await synchronize();
        window.localStorage.setItem(QUEEN_SYNC_RESULT, QUEEN_SYNC_RESULT_SUCCESS);
        redirect();
      } else {
        window.localStorage.setItem(QUEEN_SYNC_RESULT, QUEEN_SYNC_RESULT_FAILURE);
        redirect();
      }
    } catch (e) {
      console.log(e.message);
      window.localStorage.setItem(QUEEN_SYNC_RESULT, QUEEN_SYNC_RESULT_FAILURE);
      redirect();
    }
  }, [synchronize]);

  useEffect(() => {
    if (toSynchronize && !pending) {
      launchSynchronize();
    }
  }, [toSynchronize, pending, launchSynchronize]);

  return (
    <>
      {!pending && !toSynchronize && (
        <StyleWrapper>
          <div className="content">
            <h1>{D.syncPage}</h1>
            <h2>{D.manualSync}</h2>
            <button type="button" onClick={() => launchSynchronize()}>
              {D.synchronizeButton}
            </button>
          </div>

          <div className="version">{`Version ${version}`}</div>
        </StyleWrapper>
      )}
      {pending && (
        <StyleWrapper>
          <Preloader title={D.syncInProgress} message={waitingMessage} />
          {!!sendingProgress && <ProgressBar value={sendingProgress} />}
          {!sendingProgress && campaignProgress !== null && (
            <div className="sync-detail">
              <p>
                <span className={current === 'questionnaire' ? 'current' : ''}>
                  {`${D.waitingLoadingCampaigns} : `}
                </span>
                <ProgressBar value={campaignProgress} />
              </p>

              <p>
                <span className={current === 'resources' ? 'current' : ''}>
                  {`${D.waitingLoadingResources} : `}
                </span>
                <ProgressBar value={resourceProgress} />
              </p>

              <p>
                <span className={current === 'survey-units' ? 'current' : ''}>
                  {`${D.waitingLoadingSU} : `}
                </span>
                <ProgressBar value={surveyUnitProgress} />
              </p>
            </div>
          )}
        </StyleWrapper>
      )}
    </>
  );
};

export default Synchronize;
