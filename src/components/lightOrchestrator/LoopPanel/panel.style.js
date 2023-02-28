import { makeStyles } from '@material-ui/core';

export const useStyles = (current, reachable) =>
  makeStyles(() => ({
    panel: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1em',
      padding: '1em',
      boxShadow: 'none',
      border: !current && '1px solid rgba(0, 0, 0, .125)',
      backgroundColor: current ? '#455a79' : '#cccccc',
      color: current ? 'white' : '#455a79',
      alignItems: 'center',
      cursor: reachable && !current ? 'pointer' : 'auto',
    },
  }))();
