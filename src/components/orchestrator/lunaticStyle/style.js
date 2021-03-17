import { makeStyles } from '@material-ui/core';

const borderColorCheckbox = '#aaaaaa';
const backgroundColorCheckbox = '#d6d6d6';
const backgroundColorCheckboxChecked = '#9fc5f8';
const modalityLabelColor = 'black';
const modalityLabelColorChecked = '#1d63a0';
const modalityCodeBackgroundColor = 'white';
const borderInput = '1px solid #767676';

export const useCustomLunaticStyles = makeStyles(theme => ({
  lunatic: {
    width: '80%',
    marginLeft: '100px',
    marginTop: '3em',
    marginRight: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
    },
    // to replace checkbox by svg
    '& .list-icon': { position: 'absolute', marginTop: '-0.2rem' },
    '& .checkbox-boolean-lunatic': {
      position: 'absolute',
      opacity: 0,
      marginBottom: 0,
      marginTop: '0.15rem',
      marginLeft: '0.2rem',
      height: '18px',
      width: '18px',
    },

    '& .radio-lunatic': {
      position: 'absolute',
      opacity: 0,
      marginBottom: 0,
      marginTop: '0.05rem',
      marginLeft: '0.2rem',
      height: '20px',
      width: '20px',
    },
    '& .radio-lunatic + label': { marginLeft: '2rem', marginTop: '2rem' },
    '& .radio-modality': { marginBottom: '0.8em' },

    '& .datepicker-lunatic': {
      fontSize: '100%',
      marginLeft: '1em',
      borderRadius: '10px',
      border: `${borderInput}`,
      padding: '5px',
      '&:focus': {
        outline: 'none',
        boxShadow: `0 0 5px ${theme.palette.declarations.main}`,
      },
    },

    '& .unit': {
      position: 'relative',
      left: '0.5em',
      fontWeight: 'bold',
    },
    '& .declaration-lunatic': {
      color: theme.palette.declarations.main,
      marginTop: '1em',
      fontWeight: 'normal',
      fontSize: '92%',
    },

    '& .label-top label': {
      fontWeight: 'bold',
    },
    '& .lunatic-dropdown-label': {
      fontWeight: 'bold',
    },
    '& .checkbox-boolean-modality label': {
      fontWeight: 'bold',
    },

    '& fieldset legend': {
      fontWeight: 'bold',
    },
    '& .field-container': {
      marginTop: '1em',
    },
    '& .textarea-lunatic': {
      padding: '0.5em',
      fontSize: '100%',
      marginLeft: '1em',
      borderRadius: '10px',
      border: `${borderInput}`,
      width: '55%',
      minWidth: '200px',
      height: '10em',
      '&:focus': {
        outline: 'none',
        boxShadow: `0 0 5px ${theme.palette.declarations.main}`,
      },
    },
    '& .input-lunatic': {
      paddingRight: '0.5em',
      paddingLeft: '0.5em',
      fontSize: '100%',
      marginLeft: '1em',
      borderRadius: '10px',
      border: `${borderInput}`,
      width: '55%',
      minWidth: '200px',
      height: '1.5em',
      '&:focus': {
        outline: 'none',
        boxShadow: `0 0 5px ${theme.palette.declarations.main}`,
      },
      "&[type='number']": {
        width: '7em',
        minWidth: '7em',
      },
    },
    '& .split-fieldset fieldset.checkbox-group': {
      '& .checkbox-modality': {
        display: 'inline-block',
        width: '40%',
        margin: '4px',
        [theme.breakpoints.down('xs')]: {
          display: 'block',
          width: '70%',
          margin: '8px',
        },
      },
    },

    '& fieldset.checkbox-group': {
      padding: 0,
      margin: 0,
      border: 'none',

      '& .field-container': {
        marginTop: 0,
      },

      '& .checkbox-modality': {
        whiteSpace: 'nowrap',
        display: 'block',
        borderRadius: '5px',
        border: `1px solid ${borderColorCheckbox}`,
        backgroundColor: `${backgroundColorCheckbox}`,
        margin: '8px',
        width: '60%',

        '& .list-icon': {
          display: 'none',
        },

        '&.content-checked': {
          backgroundColor: `${backgroundColorCheckboxChecked}`,
          borderColor: `${modalityLabelColorChecked}`,
        },
        '& label': {
          display: 'inline-block',
          padding: '0.8em 0.5em 0.8em 1.7em',
          position: 'relative',
          right: '1.3em',
          width: '92%',
          [theme.breakpoints.down('md')]: {
            width: '85%',
          },
        },
      },

      '& .code-modality': {
        position: 'relative',
        left: '-1em',
        padding: '0.3em 0.5em 0.3em 0.5em',
        color: `${modalityLabelColor}`,
        fontXeight: 'bold',
        border: `1px solid ${borderColorCheckbox}`,
        backgroundColor: `${modalityCodeBackgroundColor}`,
        borderRadius: '5px',
      },

      '& .checkbox-lunatic': {
        opacity: 0,

        '&:checked + label::after': {
          float: 'right',
          content: "'✓'",
        },
        '&:focus + label, &:hover + label, &:checked + label': {
          color: `${modalityLabelColorChecked}`,
          fontWeight: 'bold',
          '& .code-modality': {
            color: `${modalityCodeBackgroundColor}`,
            backgroundColor: theme.palette.declarations.main,
            borderColor: theme.palette.declarations.main,
          },
        },
      },
    },
  },
}));
