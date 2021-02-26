import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    '&:hover,&:focus': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.main,
    },
  },
}));

export const Button = ({
  className,
  color,
  children,
  disabled,
  onClick,
  startIcon,
  endIcon,
  ...other
}) => {
  const classes = useStyles();

  return (
    <MuiButton
      className={`${classes.root} ${className}`}
      disabled={disabled}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      {...other}
    >
      {children}
    </MuiButton>
  );
};
