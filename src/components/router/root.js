import React, { useEffect, useState } from 'react';
import root from 'react-shadow';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Orchestrator from '../orchestrator';
import styles from '../style/style.scss';
import NotFound from '../shared/not-found';

const Root = () => {
  const customStyle = {
    margin: 'auto',
    height: '100vh',
    fontFamily: "'Gotham SSm A', 'Gotham SSm B', sans-serif",
    backgroundColor: '#c3ddff',
  };

  window.addEventListener('QUEEN', e => {
    console.log('Queen : receive event queen :' + e.detail.action);
  });

  return (
    <>
      <root.div id="queen-container" style={customStyle}>
        <style type="text/css">{styles}</style>
        <Router>
          <Switch>
            <Route path="/queen/questionnaire/:id" component={Orchestrator} />
          </Switch>
        </Router>
      </root.div>
    </>
  );
};

export default Root;
