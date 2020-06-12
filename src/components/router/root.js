import React from 'react';
import PropTypes from 'prop-types';
import withAuth from 'utils/HOC/withAuth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { READ_ONLY } from 'utils/constants';
import NotFound from 'components/shared/not-found';
import Notification from 'components/shared/Notification';
import OrchestratorManager from 'components/orchestratorManager';
import { StyleWrapper } from './root.style';

const Rooter = ({ configuration }) => (
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
);

Rooter.propTypes = {
  configuration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withAuth(Rooter);
