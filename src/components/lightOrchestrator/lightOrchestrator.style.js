import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
  },
  bodyContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    backgroundColor: '#eeeeee',
    justifyContent: 'space-between',
  },
  loopInfo: {
    position: 'absolute',
    // 65(width of top bar) + 4
    top: '69px',
    // 60(width of right bar) + 4
    right: '64px',
  },
}));
