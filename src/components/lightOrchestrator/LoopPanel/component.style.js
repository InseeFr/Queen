import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(currentPanel => ({
  loops: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
    marginTop: '1em',
    marginRight: '1em',
  },
  panel: {
    padding: '1em',
    boxShadow: 'none',
    border: '1px solid rgba(0, 0, 0, .125)',
    backgroundColor: currentPanel ? '#455a79' : '#cccccc',
    color: currentPanel ? 'white' : '#455a79',
  },
}));
