import React from 'react';
import root from 'react-shadow/material-ui';
import { BrowserRouter } from 'react-router-dom';
import Rooter from 'components/router';
import { StyleProvider } from 'components/style';
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
          <StyleProvider>
            <ServiceWorkerNotification standalone={configuration.standalone} />
            <AuthProvider authType={configuration.authenticationType}>
              <BrowserRouter>
                <Rooter />
              </BrowserRouter>
            </AuthProvider>
          </StyleProvider>
        </AppContext.Provider>
      )}
      {!configuration && <Preloader message={D.waitingConfiguration} />}
    </root.div>
  );
};

export default App;
