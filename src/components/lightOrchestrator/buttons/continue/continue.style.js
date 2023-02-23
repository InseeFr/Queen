import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  wrapperButton: {
    display: 'flex',
    marginBottom: '1em',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: '4em',
    minHeight: '2.3em',
    gap: '0.5em',
  },
  root: { width: 'auto' },
  labelHelp: { fontSize: '84%' },
  help: { fontSize: '72%', color: '#777777' },
});
