import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import root from 'react-shadow/styled-components';
import D from 'i18n';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AUTHENTICATION_MODE_ENUM, READ_ONLY } from 'utils/constants';
import Preloader from 'components/shared/preloader';
import NotFound from 'components/shared/not-found';
import Notification from 'components/shared/Notification';
import OrchestratorManager from 'components/orchestratorManager';

import { StyleWrapper } from './root.style';

const Root = () => {
  const customStyle = {
    margin: 'auto',
    height: '100vh',
    fontFamily: "'Gotham SSm A', 'Gotham SSm B', sans-serif",
    backgroundColor: '#c3ddff',
  };
  const [configuration, setConfiguration] = useState(undefined);

  useEffect(() => {
    if (!configuration) {
      const loadConfiguration = async () => {
        const QUEEN_URL = window.localStorage.getItem('QUEEN_URL') || '';
        const publicUrl = window.location.origin;
        const response = await fetch(`${QUEEN_URL}/configuration.json`);
        let configurationResponse = await response.json();
        configurationResponse.standalone = configurationResponse.QUEEN_URL === publicUrl;
        console.log(`Standalone : ${configurationResponse.QUEEN_URL === publicUrl}`);
        setConfiguration(configurationResponse);
      };
      loadConfiguration();
    }
  }, [configuration]);

  return (
    <>
      <root.div id="queen-container" style={customStyle}>
        {configuration && (
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
        {!configuration && <Preloader message={D.waitingConfiguration} />}
      </root.div>
    </>
  );
};

Root.propTypes = {
  configuration: PropTypes.shape({
    standalone: PropTypes.bool.isRequired,
    QUEEN_URL: PropTypes.string.isRequired,
    QUEEN_API_URL: PropTypes.string.isRequired,
    QUEEN_AUTHENTICATION_MODE: PropTypes.oneOf(AUTHENTICATION_MODE_ENUM).isRequired,
  }),
};

export default Root;
