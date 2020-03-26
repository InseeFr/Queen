import React from 'react';
import PropTypes from 'prop-types';
import root from 'react-shadow';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import OrchestratorManager from '../orchestratorManager';
import styles from '../style/style.scss';
import NotFound from '../shared/not-found';

const Root = ({ isStandalone, authenticationMode }) => {
  const customStyle = {
    margin: 'auto',
    height: '100vh',
    fontFamily: "'Gotham SSm A', 'Gotham SSm B', sans-serif",
    backgroundColor: '#c3ddff',
  };

  window.addEventListener('QUEEN', e => {
    console.log('Queen : receive event queen :' + e.detail.action);
  });

  return (
    <>
      <root.div id="queen-container" style={customStyle}>
        <style type="text/css">{styles}</style>
        <Router>
          <Switch>
            <Route
              path="/queen/questionnaire/:idQ/survey-unit/:idSU"
              component={routeProps => (
                <OrchestratorManager
                  {...routeProps}
                  standalone={isStandalone}
                  authenticationMode={authenticationMode}
                />
              )}
            />
          </Switch>
        </Router>
      </root.div>
    </>
  );
};

Root.propTypes = {
  isStandalone: PropTypes.bool.isRequired,
  authenticationMode: PropTypes.oneOf(['anonymous']).isRequired,
};

export default Root;
