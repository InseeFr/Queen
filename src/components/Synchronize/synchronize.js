import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import Preloader from 'components/shared/preloader';
import { synchronize } from 'utils/synchronize';
import { QUEEN_SYNC_RESULT } from 'utils/constants';
import { StyleWrapper } from './synchronize.style';
import { version } from '../../../package.json';

const Synchronize = ({ location }) => {
  const [id] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('id');
  });

  const [waitingMessage, setWaitingMessage] = useState(null);

  const [pending, setPending] = useState(false);
  const redirect = () => {
    window.location = window.location.origin;
  };

  const launchSynchronize = async () => {
    try {
      if (navigator.onLine) {
        window.localStorage.setItem(QUEEN_SYNC_RESULT, 'pending');
        setPending(true);
        await synchronize({ setWaitingMessage });
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
  };

  useEffect(() => {
    if (id) {
      launchSynchronize();
    }
  }, [id]);

  return (
    <>
      {!pending && !id && (
        <StyleWrapper>
          <h1>{D.syncPage}</h1>
          <h2>{D.manualSync}</h2>
          <button type="button" onClick={() => launchSynchronize()}>
            {D.synchronizeButton}
          </button>
          <div className="version">{`Version ${version}`}</div>
        </StyleWrapper>
      )}
      {pending && <Preloader title={D.syncInProgress} message={waitingMessage} />}
    </>
  );
};

Synchronize.propTypes = {
  location: PropTypes.objectOf({ search: PropTypes.string.isRequired }).isRequired,
};

export default Synchronize;
