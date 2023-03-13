import React from 'react';
import D from 'i18n';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { AppVersion } from 'components/designSystem';

const useStyles = makeStyles(theme => ({
  box: { padding: '3em', textAlign: 'center' },
  message: { marginTop: '2em' },
  title: {
    color: theme.palette.error.main,
  },
}));

const Error = ({ message = '' }) => {
  const classes = useStyles();
  return (
    <Box className={classes.box}>
      <Typography variant="h3" className={classes.title}>
        {D.errorOccurred}
      </Typography>
      <Typography className={classes.message} variant="h4">
        {message}
      </Typography>
      <AppVersion />
    </Box>
  );
};

export default Error;
