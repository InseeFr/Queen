import { Paper } from '@material-ui/core';
import React from 'react';
import { useStyles } from './panel.style';

export const Panel = ({ key, iterationValue, current, reachable, onClick }) => {
  const classes = useStyles(reachable);
  return (
    <>
      <Paper className={classes.panel} key={key} onClick={onClick}>
        {iterationValue}
      </Paper>
    </>
  );
};
