import { IconButton as MuiIconButton } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    '&:hover,&:focus': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.main,
    },
  },
  iconButton: {
    backgroundColor: '#9FC5F8',
    color: 'black',
    '&:hover,&:focus': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}));

export const IconButton = ({
  className,
  color,
  children,
  disabled,
  onClick,
  ariaLabel,
  ...other
}) => {
  const classes = useStyles();
  return (
    <MuiIconButton
      aria-label={ariaLabel}
      size="medium"
      className={`${classes.iconButton} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...other}
    >
      {children}
    </MuiIconButton>
  );
};
