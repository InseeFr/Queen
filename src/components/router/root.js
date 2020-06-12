import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import D from 'i18n';
import { READ_ONLY } from 'utils/constants';
import NotFound from 'components/shared/not-found';
import Notification from 'components/shared/Notification';
import OrchestratorManager from 'components/orchestratorManager';
import { StyleWrapper } from './root.style';
import { useAuth } from 'utils/hook';
import Preloader from 'components/shared/preloader';
import Error from 'components/shared/Error';

const Rooter = ({ configuration }) => {
  const { loading, authenticated } = useAuth(configuration.QUEEN_AUTHENTICATION_MODE);
  return (
    <>
      {loading && <Preloader message={D.waitingAuthentication} />}
      {!loading && !authenticated && <Error message={D.unauthorized} />}
      {!loading && authenticated && (
        <StyleWrapper>
          <Notification standalone={configuration.standalone} />
          <Router>
            <Switch>
              <Route
                path={`/queen/:${READ_ONLY}?/questionnaire/:idQ/survey-unit/:idSU`}
                component={routeProps => (
                  <OrchestratorManager {...routeProps} configuration={configuration} />
                )}
              />
              <Route path={configuration.standalone ? '/' : '/queen'} component={NotFound} />
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
