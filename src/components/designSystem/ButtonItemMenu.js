import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  item: {
    cursor: 'pointer',
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#085394',
    paddingLeft: '1.2em',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
    outline: 'thin',
    textAlign: 'left',
    '& span': { float: 'right' },
    '&.selected': {
      backgroundColor: '#9fc5f8',
      '& span': { fontWeight: 'bold' },
    },
    '&:hover, &:focus': { fontWeight: 'bold', backgroundColor: '#9fc5f8' },
    '&:disabled': {
      cursor: 'not-allowed',
      color: '#777777',
      fontWeight: 'normal',
      backgroundColor: 'transparent',
    },
  },
  backSubnavButton: { paddingLeft: '6px', '& span': { paddingRight: '1em', float: 'left' } },
}));

export const ButtonItemMenu = React.forwardRef(
  ({ className, children, back, disabled, onClick, selected, ...other }, ref) => {
    const classes = useStyles();
    return (
      <button
        type="button"
        ref={ref}
        className={`${classes.item} ${back ? classes.backSubnavButton : ''} ${
          selected ? 'selected' : ''
        }`}
        disabled={disabled}
        onClick={onClick}
        {...other}
      >
        {children}
      </button>
    );
  }
);
