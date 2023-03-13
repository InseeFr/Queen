import React from 'react';
import { CloudDownload, CloudUpload, CheckCircleOutline, Clear } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  success: {
    color: theme.palette.success.main,
  },
  failure: {
    color: theme.palette.error.main,
  },

  loading: {
    animation: `$zoom infinite 0.7s alternate`,
  },
  '@keyframes zoom ': {
    from: {
      transform: 'scale(1)',
    },

    to: {
      transform: 'scale(1.5)',
    },
  },
}));

export const IconStatus = ({ current = 'upload', ...other }) => {
  const classes = useStyles();
  if (current === 'success')
    return <CheckCircleOutline className={classes.success} {...other} fontSize="large" />;
  if (current === 'failure')
    return <Clear className={classes.failure} {...other} fontSize="large" />;
  if (current === 'upload')
    return <CloudUpload {...other} className={classes.loading} fontSize="large" />;
  return <CloudDownload {...other} className={classes.loading} fontSize="large" />;
};
