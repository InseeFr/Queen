import React from 'react';
import root from 'react-shadow/styled-components';
import Rooter from 'components/router';
import D from 'i18n';
import Preloader from 'components/shared/preloader';
import { useConfiguration } from 'utils/hook';
import customStyle from './app.style';

const App = () => {
  const { configuration } = useConfiguration();

  return (
    <root.div id="queen-container" style={customStyle}>
      {configuration && <Rooter configuration={configuration} />}
      {!configuration && <Preloader message={D.waitingConfiguration} />}
    </root.div>
  );
};

export default App;
