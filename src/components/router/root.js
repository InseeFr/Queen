import React, { useState, useEffect } from 'react';
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
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        const response = await fetch(`${publicUrl.origin}/configuration.json`);
        let configurationResponse = await response.json();
        const { urlQueen } = configurationResponse;
        if (urlQueen === publicUrl.origin) {
          configurationResponse.standalone = true;
        } else {
          const responseFromQueen = await fetch(`${urlQueen}/configuration.json`);
          configurationResponse = await responseFromQueen.json();
          configurationResponse.standalone = false;
        }
        setConfiguration(configurationResponse);
      };
      loadConfiguration();
    }
  }, [configuration]);

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
