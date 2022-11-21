import { makeStyles } from '@material-ui/core';

const menuWidthDesktop = 250;
const sequenceMenuWidthDesktop = 375;
const subsequenceMenuWidthDesktop = 250;

const menuWidthMobile = 250;
const sequenceMenuWidthMobile = 250;
const subsequenceMenuWidthMobile = 250;

export const useStyles = makeStyles(theme => ({
  navigation: { alignSelf: 'center' },
  menuIcon: {
    position: 'relative',
    zIndex: 35,
    padding: '7px',
    '& svg': { fontSize: '2em' },
  },
  itemTitle: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    marginTop: '3em',
    color: '#085394',
    paddingLeft: '1.2em',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
  },

  menu: {
    height: '100%',
    width: `${menuWidthDesktop}px`,
    left: `-${menuWidthDesktop}px`,
    position: 'fixed',
    zIndex: 30,
    top: 0,
    overflowX: 'hidden' /* Disable horizontal scroll */,
    transition: 'transform 250ms ease',
    backgroundColor: 'white',
    borderRight: '1px solid #777777',
    '&.slideIn': { transform: `translateX(${menuWidthDesktop}px)` },
    '& ul': { paddingLeft: 0 },
    '& li': { display: 'block' },

    [theme.breakpoints.down('md')]: {
      width: `${menuWidthMobile}px`,
      left: `-${menuWidthMobile}px`,
    },
  },

  version: {
    backgroundColor: 'whitesmoke',
    borderTop: '1px solid #777777',
    position: 'fixed',
    width: '100%',
    left: 0,
    bottom: 0,
    textAlign: 'center',
    paddingTop: '2px',
    paddingBottom: '2px',
  },

  navigationContainer: { marginTop: '80px' },
  goToNavigationSpan: {
    fontSize: '80%',
    color: '#777777',
    textTransform: 'uppercase',
    paddingLeft: '1.2em',
  },
  backgroundMenu: {
    outline: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 20,
    width: '100%',
    height: '100%',
    backgroundColor: 'grey',
    opacity: 0.5,
  },

  title: { padding: '0.3em', paddingLeft: '1.2em', textTransform: 'uppercase', fontSize: '80%' },

  subMenuNavigationContainer: {
    height: '100%',
    position: 'absolute',
    top: 0,
    overflowX: 'hidden' /* Disable horizontal scroll */,
    transition: 'transform 450ms ease',
    '& ul': { paddingLeft: 0 },
    borderRight: '1px solid #777777',
    [theme.breakpoints.down('md')]: { '& .content': { marginTop: '70px' } },
  },

  sequenceNavigationContainer: {
    width: `${sequenceMenuWidthDesktop}px`,
    left: `-${sequenceMenuWidthDesktop}px`,
    zIndex: 29,
    backgroundColor: '#eeeeee',
    '& .content > div': { marginTop: '45px' },
    '&.slideIn': { transform: `translateX(${menuWidthDesktop + sequenceMenuWidthDesktop}px)` },
    [theme.breakpoints.down('md')]: {
      width: `${sequenceMenuWidthMobile}px`,
      left: `-${sequenceMenuWidthMobile}px`,
      zIndex: 31,
      '&.slideIn': { transform: `translateX(${sequenceMenuWidthMobile}px)` },
    },
  },

  subsequenceNavigationContainer: {
    width: `${subsequenceMenuWidthDesktop}px`,
    left: `${menuWidthDesktop - subsequenceMenuWidthDesktop}px`,
    zIndex: 28,
    backgroundColor: 'white',
    '& ul': { paddingLeft: 0 },
    '&.slideIn': {
      transform: `translateX(${sequenceMenuWidthDesktop + subsequenceMenuWidthDesktop}px)`,
    },
    [theme.breakpoints.down('md')]: {
      width: `${subsequenceMenuWidthMobile}px`,
      left: `-${subsequenceMenuWidthMobile}px`,
      zIndex: 32,
      '&.slideIn': { transform: `translateX(${subsequenceMenuWidthMobile}px)` },
    },
  },
}));
