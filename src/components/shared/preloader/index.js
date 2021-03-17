import React from 'react';
import PropTypes from 'prop-types';
import imgPreloader from 'img/preloader.svg';
import D from 'i18n';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    margin: 'auto',
    width: '100%',
    height: '100%',
    textAlign: 'center',
  },
  title: {
    color: '#292664',
  },
});

const Preloader = ({ title, message }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <img src={imgPreloader} alt="waiting..." className={classes.svg} />
      <Typography variant="h3" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="h4">{message}</Typography>
    </div>
  );
};

Preloader.defaultProps = {
  title: D.pleaseWait,
  message: '',
};

Preloader.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default Preloader;
