import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import ProgressBar from 'components/shared/ProgressBar';
import Preloader from 'components/shared/preloader';
import { QUEEN_SYNC_RESULT } from 'utils/constants';
import { useSynchronisation } from 'utils/synchronize';
import { StyleWrapper } from './synchronize.style';
import { version } from '../../../package.json';

const Synchronize = ({ location }) => {
  const [id] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('id');
  });

  const [pending, setPending] = useState(false);
  const {
    synchronize,
    sendingProgress,
    waitingMessage,
    operationProgress,
    resourceProgress,
    surveyUnitProgress,
  } = useSynchronisation();

  const redirect = () => {
    window.location = window.location.origin;
  };

  const launchSynchronize = useCallback(async () => {
    try {
      if (navigator.onLine) {
        window.localStorage.setItem(QUEEN_SYNC_RESULT, 'pending');
        setPending(true);
        await synchronize();
        window.localStorage.setItem(QUEEN_SYNC_RESULT, 'success');
        redirect();
      } else {
        window.localStorage.setItem(QUEEN_SYNC_RESULT, 'failure');
        redirect();
      }
    } catch (e) {
      console.log(e.message);
      window.localStorage.setItem(QUEEN_SYNC_RESULT, 'failure');
      redirect();
    }
  }, [synchronize]);

  const getProgress = () => {
    if (sendingProgress) return sendingProgress;
    if (surveyUnitProgress) return surveyUnitProgress;
    if (resourceProgress) return resourceProgress;
    if (operationProgress) return operationProgress;
    return null;
  };

  useEffect(() => {
    if (id) {
      launchSynchronize();
    }
  }, [id, launchSynchronize]);

  return (
    <>
      {!pending && !id && (
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
          {getProgress() && <ProgressBar value={getProgress()} />}
        </StyleWrapper>
      )}
    </>
  );
};

Synchronize.propTypes = {
  location: PropTypes.objectOf({ search: PropTypes.string.isRequired }).isRequired,
};

export default Synchronize;
