import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: '2em',
    paddingBottom: '2em',
    alignItems: 'center',
    borderLeft: '1px solid #777777',
  },
  detail: { display: 'block' },
  page: {
    marginTop: '0.3em',
    paddingTop: '0.3em',
    paddingBottom: '0.3em',
    fontSize: '80%',
    textAlign: 'center',
    borderRadius: '5px',
    width: '57px',
    backgroundColor: 'white',
  },
  labelPage: { fontSize: '90%', marginBottom: '4px' },
});
