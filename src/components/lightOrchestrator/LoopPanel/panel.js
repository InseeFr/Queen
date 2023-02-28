import { Paper, Typography } from '@material-ui/core';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React from 'react';
import { useStyles } from './panel.style';

export const Panel = ({ key, value, current, reachable, onClick }) => {
  const classes = useStyles(current, reachable);
  return (
    <>
      <Paper
        className={classes.panel}
        key={key}
        onClick={reachable && !current ? onClick : () => {}}
      >
        <Typography>{value}</Typography>
        {reachable && !current && <ArrowForwardIosIcon />}
      </Paper>
    </>
  );
};
