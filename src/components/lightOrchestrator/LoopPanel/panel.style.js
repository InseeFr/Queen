import { makeStyles } from '@material-ui/core';

export const useStyles = currentPanel =>
  makeStyles(() => ({
    panel: {
      padding: '1em',
      boxShadow: 'none',
      border: '1px solid rgba(0, 0, 0, .125)',
      backgroundColor: currentPanel ? '#455a79' : '#cccccc',
      color: currentPanel ? 'white' : '#455a79',
    },
  }))();
