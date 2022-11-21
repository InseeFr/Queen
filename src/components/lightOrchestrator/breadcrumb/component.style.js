import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: props => ({
    paddingBottom: `${!props.subsequence ? '3px' : '0px'}`,
    borderBottom: `${!props.subsequence ? `${theme.palette.declarations.main} 2px solid` : ''}`,
    width: 'max-content',
    color: 'black',
    marginTop: '0.3em',
  }),

  breadcrumbButton: {
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    textTransform: 'uppercase',
    fontSize: '95%',
    '&:hover': {
      fontWeight: 'bold',
    },

    '&::before': {
      content: "'\u3009'",
      marginRight: '0.8em',
      fontWeight: 'bold',
    },
  },

  subsequenceButton: {
    '&::before': {
      content: "'\u3009'",
      marginRight: '0.8em',
      fontWeight: 'bold',
    },

    marginLeft: '0.8em',
    display: 'inline',
    paddingBottom: '3px',
    borderBottom: `${theme.palette.declarations.main} 2px solid`,
  },
}));
