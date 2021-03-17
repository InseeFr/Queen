import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  root: {
    gridColumnStart: 2,
    gridColumnEnd: 2,
    gridRowStart: 1,
    gridRowEnd: 3,
    position: 'relative',
    borderLeft: '1px solid #777777',
  },
  page: {
    position: 'absolute',
    bottom: '200px',
    right: '3px',
    paddingTop: ' 0.3em',
    paddingBottom: '0.3em',
    fontSize: '80%',
    textAlign: 'center',
    borderRadius: '5px',
    width: '90%',
    margin: 'auto',
    backgroundColor: 'white',
  },
  labelPage: { fontSize: '90%', marginBottom: '4px' },
});
