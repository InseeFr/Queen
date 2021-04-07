import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { CircularProgress, makeStyles } from '@material-ui/core';

const SimpleLoader = () => {
  const useStyles = makeStyles(theme => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }));

  return (
    <Backdrop open className={useStyles().backdrop}>
      <CircularProgress />
    </Backdrop>
  );
};

export default SimpleLoader;
