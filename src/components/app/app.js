import React, { useState, useEffect } from 'react';
import root from 'react-shadow/styled-components';
import Rooter from 'components/router';
import D from 'i18n';
import Preloader from 'components/shared/preloader';
import { QUEEN_URL } from 'utils/constants';

const App = () => {
  const customStyle = {
    margin: 'auto',
    height: '100vh',
    fontFamily: "'Gotham SSm A', 'Gotham SSm B', sans-serif",
    backgroundColor: '#c3ddff',
  };
  const [configuration, setConfiguration] = useState(null);
  useEffect(() => {
    if (!configuration) {
      const loadConfiguration = async () => {
        const response = await fetch(`${QUEEN_URL}/configuration.json`);
        const configurationResponse = await response.json();
        configurationResponse.standalone =
          configurationResponse.QUEEN_URL === window.location.origin;
        setConfiguration(configurationResponse);
      };
      loadConfiguration();
    }
  }, [configuration]);

  return (
    <root.div id="queen-container" style={customStyle}>
      {configuration && <Rooter configuration={configuration} />}
      {!configuration && <Preloader message={D.waitingConfiguration} />}
    </root.div>
  );
};

export default App;
