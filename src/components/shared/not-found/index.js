import React from 'react';
import D from 'i18n';
import { Link } from 'react-router-dom';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { AppVersion } from 'components/designSystem';

const useStyles = makeStyles(theme => ({
  box: {
    padding: '3em',
    textAlign: 'center',
  },
  item: { marginBottom: theme.spacing(2) },
  title: {
    color: '#292664',
  },
}));

const NotFound = () => {
  const classes = useStyles();
  return (
    <Box className={classes.box}>
      <Typography variant="h3" className={classes.title}>
        {D.pageNotFound}
      </Typography>
      <Typography variant="h4" className={classes.item}>
        {D.pageNotFoundHelp}
      </Typography>
      <Link className={classes.item} to="/queen/visualize">
        {D.goToVisualizePage}
      </Link>
      <AppVersion />
    </Box>
  );
};

export default NotFound;
