import { FormControl, Select, InputLabel } from '@material-ui/core';
import D from 'i18n';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { QUESTIONNAIRE_EXAMPLES } from 'utils/constants';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Examples = ({ selected, setSelected, className }) => {
  const classes = useStyles();
  const handleChange = event => {
    setSelected(event.target.value);
  };
  return (
    <FormControl className={`${classes.formControl} ${className}`}>
      <InputLabel htmlFor="native-simple">{D.labelExample}</InputLabel>
      <Select
        native
        value={selected}
        onChange={handleChange}
        inputProps={{
          name: 'questionnaire',
          id: 'native-simple',
        }}
      >
        <option value="">{D.labelExamples}</option>
        {QUESTIONNAIRE_EXAMPLES.map(v => {
          return (
            <option key={v} value={v}>
              {v.toUpperCase()}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default Examples;
