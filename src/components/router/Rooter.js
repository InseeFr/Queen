import React, { useContext } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { READ_ONLY } from 'utils/constants';
import OrchestratorManager from 'components/orchestratorManager';
import QueenRedirect from 'components/queenRedirect';
import Synchronize from 'components/Synchronize';
import Visualizer from 'components/visualizer';
import { AppContext } from 'components/app';
import { secure } from 'components/auth';

const Rooter = () => {
  const { standalone } = useContext(AppContext);
  const { pathname } = useLocation();

  return (
    <Switch>
      <Route
        path={`/queen/:${READ_ONLY}?/questionnaire/:idQ/survey-unit/:idSU`}
        component={secure(OrchestratorManager)}
      />
      <Route path={`/queen/:${READ_ONLY}?/survey-unit/:idSU`} component={secure(QueenRedirect)} />
      {!standalone && <Route path="/queen/synchronize" component={secure(Synchronize)} />}
      <Route path="/queen/visualize" component={Visualizer} />
      {!standalone &&
        !pathname.startsWith('/queen/authentication') &&
        pathname.startsWith('/queen') && <Redirect to="/queen/visualize" />}
      {standalone && !pathname.startsWith('/queen/authentication') && (
        <Redirect to="/queen/visualize" />
      )}
    </Switch>
  );
};

export default Rooter;
