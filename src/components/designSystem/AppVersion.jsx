import { makeStyles } from '@material-ui/core';
import React from 'react';
import { version, dependencies } from '../../../package.json';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid black',
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    padding: '2px 0 2px 0',
  },
});

const lunaticVersion = dependencies['@inseefr/lunatic'].replace('^', '');

export const AppVersion = () => {
  const classes = useStyles();
  return <div className={classes.root}>{`Queen : ${version} | Lunatic : ${lunaticVersion}`}</div>;
};
