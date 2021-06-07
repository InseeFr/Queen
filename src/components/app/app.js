import React, { useEffect, useState } from 'react';
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
import { addOnlineStatusObserver } from 'utils';

export const AppContext = React.createContext();

const App = () => {
  const { configuration } = useConfiguration();
  const [init, setInit] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    if (!init) {
      addOnlineStatusObserver(s => {
        setOnline(s);
      });
      setInit(true);
    }
  }, [init]);

  return (
    <root.div id="queen-container" style={customStyle}>
      {configuration && (
        <AppContext.Provider value={{ ...configuration, online: online }}>
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
