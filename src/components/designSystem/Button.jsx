import React from 'react';
import { Button as MuiButton, IconButton as MuiIconButton } from '@material-ui/core';
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

export const Button = React.forwardRef(
  ({ className, color, children, disabled, onClick, startIcon, endIcon, ...other }, ref) => {
    const classes = useStyles();
    return (
      <MuiButton
        ref={ref}
        className={`${classes.button} ${className}`}
        disabled={disabled}
        onClick={onClick}
        startIcon={startIcon}
        endIcon={endIcon}
        {...other}
      >
        {children}
      </MuiButton>
    );
  }
);

export const IconButton = React.forwardRef(
  ({ className, color, children, disabled, onClick, ariaLabel, ...other }, ref) => {
    const classes = useStyles();
    return (
      <MuiIconButton
        aria-label={ariaLabel}
        size="medium"
        ref={ref}
        className={`${classes.iconButton} ${className}`}
        disabled={disabled}
        onClick={onClick}
        {...other}
      >
        {children}
      </MuiIconButton>
    );
  }
);
