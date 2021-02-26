import React from 'react';
import root from 'react-shadow/styled-components';
import Rooter from 'components/router';
import { AuthProvider } from 'components/auth';
import ServiceWorkerNotification from 'components/shared/serviceWorkerNotification';
import D from 'i18n';
import Preloader from 'components/shared/preloader';
import { useConfiguration } from 'utils/hook';
import customStyle from './app.style';

export const AppContext = React.createContext();

const App = () => {
  const { configuration } = useConfiguration();

  return (
    <root.div id="queen-container" style={customStyle}>
      {configuration && (
        <AppContext.Provider value={configuration}>
          <ServiceWorkerNotification standalone={configuration.standalone} />
          <AuthProvider authType={configuration.authenticationType}>
            <Rooter configuration={configuration} />
          </AuthProvider>
        </AppContext.Provider>
      )}
      {!configuration && <Preloader message={D.waitingConfiguration} />}
    </root.div>
  );
};

export default App;
