import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import D from 'i18n';
import { READ_ONLY } from 'utils/constants';
import NotFound from 'components/shared/not-found';
import ServiceWorkerNotification from 'components/shared/serviceWorkerNotification';
import OrchestratorManager from 'components/orchestratorManager';
import { useAuth } from 'utils/hook';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';
import Synchronize from 'components/Synchronize';
import { StyleWrapper } from './root.style';

const Rooter = ({ configuration }) => {
  const { standalone } = configuration;
  const { loading, authenticated } = useAuth(configuration.QUEEN_AUTHENTICATION_MODE);

  return (
    <>
      {loading && <Preloader message={D.waitingAuthentication} />}
      {!loading && !authenticated && <Error message={D.unauthorized} />}
      {!loading && authenticated && (
        <StyleWrapper>
          <ServiceWorkerNotification authenticated={authenticated} standalone={standalone} />
          <Router>
            <Switch>
              <Route
                path={`/queen/:${READ_ONLY}?/questionnaire/:idQ/survey-unit/:idSU`}
                component={routeProps => (
                  <OrchestratorManager {...routeProps} configuration={configuration} />
                )}
              />
              {!standalone && (
                <Route
                  path="/queen/synchronize"
                  component={routeProps => <Synchronize {...routeProps} />}
                />
              )}
              <Route
                path="/queen/visualize"
                component={routeProps => (
                  <OrchestratorManager {...routeProps} configuration={configuration} visualize />
                )}
              />
              <Route path={standalone ? '/' : '/queen'} component={NotFound} />
            </Switch>
          </Router>
        </StyleWrapper>
      )}
    </>
  );
};

Rooter.propTypes = {
  configuration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Rooter;
