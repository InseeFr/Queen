import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    paddingRight: '15%',
    bottom: 0,
    right: 0,
    display: 'grid',
    margin: 'auto',
    whiteSpace: 'nowrap',
    gridTemplateRows: '60px 60px 60px',
  },

  shortButtonSpan: {
    color: '#777777',
    fontSize: '13px',
    display: 'block',
    width: 'min-content',
    marginLeft: 'auto',
  },

  nextButton: { gridRowStart: 2, gridRowEnd: 2 },
  fastButtonWrapper: { gridRowStart: 3, gridRowEnd: 3 },
  fastButton: { borderRadius: '15px', fontSize: '95%' },

  fastButtonSpan: { display: 'block', fontSize: '68%' },

  navigation: { textAlign: 'right' },

  previousIcon: { transform: 'rotate(180deg)' },
}));
