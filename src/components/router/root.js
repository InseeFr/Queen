import React from 'react';
import PropTypes from 'prop-types';
import root from 'react-shadow';
import D from 'i18n';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AUTHENTICATION_MODE_ENUM, READ_ONLY } from 'utils/constants';
import Preloader from 'components/shared/preloader';
import NotFound from 'components/shared/not-found';
import Notification from 'components/shared/Notification';
import OrchestratorManager from 'components/orchestratorManager';
import styles from '../style/style.scss';

const Root = ({ configuration }) => {
  const customStyle = {
    margin: 'auto',
    height: '100vh',
    fontFamily: "'Gotham SSm A', 'Gotham SSm B', sans-serif",
    backgroundColor: '#c3ddff',
  };

  return (
    <>
      <root.div id="queen-container" style={customStyle}>
        {configuration && (
          <>
            <style type="text/css">{styles}</style>
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
          </>
        )}
        {!configuration && <Preloader message={D.waitingConfiguration} />}
      </root.div>
    </>
  );
};

Root.propTypes = {
  configuration: PropTypes.shape({
    standalone: PropTypes.bool.isRequired,
    urlQueen: PropTypes.string.isRequired,
    urlQueenApi: PropTypes.string.isRequired,
    authenticationMode: PropTypes.oneOf(AUTHENTICATION_MODE_ENUM).isRequired,
  }),
};

export default Root;
