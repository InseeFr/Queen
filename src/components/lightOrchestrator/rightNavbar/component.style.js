import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    backgroundColor: 'yellow',
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
    margin: 'auto',
    backgroundColor: 'red',
  },
  pages: {
    // position: 'absolute',
    // bottom: '200px',
    backgroundColor: 'green',
  },
  labelPage: { fontSize: '90%', marginBottom: '4px' },
});
