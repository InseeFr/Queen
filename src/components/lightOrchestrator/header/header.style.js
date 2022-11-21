import { makeStyles } from '@material-ui/core';

const backgroundHeaderColor = 'white';
const borderStyleHeader = '1px solid #777777';
const widthBorder = '59px'; // 60(width grid template) - 1(border-width)

export const useStyles = makeStyles(theme => ({
  root: props => ({
    width: '100%',
    flex: '0 1 65px',
    display: 'grid',
    gridTemplateColumns: `${props.standalone ? '60px 60px auto' : '60px 60px auto 60px'}`,
    backgroundColor: 'white',
    borderRight: 0,
    borderLeft: 0,
    borderBottom: `${borderStyleHeader}`,
  }),
  headerItemNavigation: {
    height: '100%',
    width: `${widthBorder}`,
    borderRight: `${borderStyleHeader}`,
  },
  headerClose: {
    width: `${widthBorder}`,
    borderLeft: `${borderStyleHeader}`,
  },
  headerLogo: {
    padding: '6px',
    marginLeft: '2px',
    justifySelf: 'center',
    alignSelf: 'center',
    height: '50px',
    width: 'auto',
    backgroundColor: `${backgroundHeaderColor}`,
  },
  inseeIcon: {
    padding: 0,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  closeIcon: {
    padding: '5px',
    paddingTop: '7px',
    '& svg': { fontSize: '2em' },
  },

  headerTitle: {
    padding: '0.4em',
    paddingLeft: '1em',
  },
  questionnaireTitle: {
    textTransform: 'uppercase',
    fontSize: '80%',
  },
}));
