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
  mainTile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  activeView: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
}));
