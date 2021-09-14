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
  loopInfo: {
    position: 'absolute',
    // 65(width of top bar) + 4
    top: '69px',
    // 60(width of right bar) + 4
    right: '64px',
  },
}));
