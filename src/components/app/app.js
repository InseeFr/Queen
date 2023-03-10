import React, { useEffect, useMemo, useState } from 'react';

import { AuthProvider } from 'components/auth';
import { BrowserRouter } from 'react-router-dom';
import D from 'i18n';
import Preloader from 'components/shared/preloader';
import Rooter from 'components/router';
import ServiceWorkerNotification from 'components/shared/serviceWorkerNotification';
import { StyleProvider } from 'components/style';
import { addOnlineStatusObserver } from 'utils';
import customStyle from './app.style';
// import root from 'react-shadow/material-ui';
import { useConfiguration } from 'utils/hook';

export const AppContext = React.createContext();

const App = () => {
  console.log('App rerender');
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

  const contextValue = useMemo(
    () => ({ ...configuration, online: online }),
    [configuration, online]
  );

  return (
    <div id="queen-container" style={customStyle}>
      {configuration && (
        <AppContext.Provider value={contextValue}>
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
    </div>
  );
};

export default App;
