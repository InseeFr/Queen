import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { READ_ONLY } from 'utils/constants';
import NotFound from 'components/shared/not-found';
import OrchestratorManager from 'components/orchestratorManager';
import Synchronize from 'components/Synchronize';
import Visualizer from 'components/visualizer';
import { AppContext } from 'components/app';
// import { secure } from 'components/auth';
import { StyleWrapper } from './root.style';

const Rooter = () => {
  const { standalone } = useContext(AppContext);

  return (
    <StyleWrapper>
      <Router>
        <Switch>
          <Route
            path={`/queen/:${READ_ONLY}?/questionnaire/:idQ/survey-unit/:idSU`}
            component={OrchestratorManager}
          />
          {standalone && <Route path="/queen/synchronize" component={Synchronize} />}
          <Route path="/queen/visualize" component={Visualizer} />
          <Route path={standalone ? '/' : '/queen'} component={NotFound} />
        </Switch>
      </Router>
    </StyleWrapper>
  );
};

export default Rooter;
