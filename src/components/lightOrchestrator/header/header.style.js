import { makeStyles } from '@material-ui/core';

const borderStyleHeader = '1px solid #777777';

export const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottom: `${borderStyleHeader}`,
    columnGap: '0.5em',
  },
  headerItemNavigation: {
    borderRight: `${borderStyleHeader}`,
  },
  headerClose: {
    marginLeft: 'auto',
    borderLeft: `${borderStyleHeader}`,
  },
  headerLogo: {
    padding: '5px',
    height: '60px',
  },
  closeIcon: {
    padding: '5px',
    '& svg': { fontSize: '2em' },
  },

  headerTitle: {
    paddingLeft: '1em',
  },
  questionnaireTitle: {
    textTransform: 'uppercase',
    fontSize: '80%',
  },
}));
