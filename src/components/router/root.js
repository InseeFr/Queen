import React from 'react';
import PropTypes from 'prop-types';
import root from 'react-shadow';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AUTHENTICATION_MODE_ENUM, READ_ONLY } from 'utils/constants';
import OrchestratorManager from '../orchestratorManager';
import styles from '../style/style.scss';
import NotFound from '../shared/not-found';

const Root = ({ configuration }) => {
  const customStyle = {
    margin: 'auto',
    height: '100vh',
    fontFamily: "'Gotham SSm A', 'Gotham SSm B', sans-serif",
    backgroundColor: '#c3ddff',
  };

  window.addEventListener('QUEEN', e => {
    console.log(`Queen : receive event queen :${e.detail.action}`);
  });

  return (
    <>
      <root.div id="queen-container" style={customStyle}>
        <style type="text/css">{styles}</style>
        <Router>
          <Switch>
            <Route
              path={`/queen/:${READ_ONLY}?/questionnaire/:idQ/survey-unit/:idSU`}
              component={routeProps => (
                <OrchestratorManager {...routeProps} configuration={configuration} />
              )}
            />
            <Route path="/queen" component={NotFound} />
          </Switch>
        </Router>
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
  }).isRequired,
};

export default Root;
