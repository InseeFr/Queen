import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2em',
  },

  shortButtonSpan: {
    color: '#777777',
    fontSize: '13px',
    display: 'block',
    width: 'min-content',
    marginLeft: 'auto',
  },

  navigation: { textAlign: 'right' },

  previousIcon: { transform: 'rotate(180deg)' },
}));
