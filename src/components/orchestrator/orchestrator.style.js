import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
  },
  bodyContainer: {
    flex: '1 1 auto',
    backgroundColor: theme.palette.background.default,
    display: 'grid',
    gridTemplateColumns: 'auto 60px',
    gridTemplateRows: '100%',
  },
  components: {
    display: 'grid',
    gridTemplateRows: 'auto 60px',
  },
}));
