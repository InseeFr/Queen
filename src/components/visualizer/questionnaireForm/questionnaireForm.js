import React, { useEffect, useState } from 'react';
import { Button, AppVersion } from 'components/designSystem';
import D from 'i18n';
import {
  DATA_EXAMPLE_URL,
  QUESTIONNAIRE_EXAMPLE_URL,
  SIMPSONS,
  DEFAULT_DATA_URL,
} from 'utils/constants';
import { useHistory } from 'react-router-dom';
import {
  Container,
  makeStyles,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import Examples from './examples';
import Helper from './helper';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(4),
  },
  title: {
    textAlign: 'center',
  },
  selectionParent: {
    display: 'flex',
    alignItems: 'baseLine',
  },
  selection: {
    marginLeft: theme.spacing(3),
  },
  buttonParent: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(5),
  },
}));

const QuestionnaireForm = () => {
  const classes = useStyles();
  const [questionnaire, setQuestionnaire] = useState('');
  const [data, setData] = useState('');
  const [readonly, setReadonly] = useState(false);

  const [selected, setSelected] = useState('');

  useEffect(() => {
    setQuestionnaire(selected ? QUESTIONNAIRE_EXAMPLE_URL(selected) : selected);
    setData(selected ? DATA_EXAMPLE_URL(selected) : selected);
  }, [selected]);

  const history = useHistory();

  const goToQuestionnaire = e => {
    history.push({
      pathname: '/queen/visualize',
      search: `?questionnaire=${encodeURIComponent(questionnaire)}${
        data ? `&data=${encodeURIComponent(data)}` : ''
      }${readonly ? `&readonly=${readonly}` : ''}`,
    });
    e.preventDefault();
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h3" className={classes.title}>
        {D.visualizationTitlePage}
      </Typography>
      <form onSubmit={goToQuestionnaire}>
        <TextField
          id="questionnaire-url-form"
          required
          label={D.labelQuest}
          placeholder={QUESTIONNAIRE_EXAMPLE_URL(SIMPSONS)}
          helperText={D.helperTextQuest}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={questionnaire}
          onChange={({ target: { value: v } }) => {
            setQuestionnaire(v);
          }}
          variant="outlined"
        />
        <TextField
          id="data-url-form"
          label={D.labelData}
          placeholder={DEFAULT_DATA_URL}
          helperText={D.helperTextData}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={data}
          onChange={({ target: { value: v } }) => {
            setData(v);
          }}
          variant="outlined"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={readonly}
              onChange={({ target: { checked } }) => setReadonly(checked)}
              name="readonly"
              color="primary"
            />
          }
          label={D.labelReadonly}
        />
        <div className={classes.selectionParent}>
          <Typography>{D.chooseExamples}</Typography>
          <Examples className={classes.selection} selected={selected} setSelected={setSelected} />
        </div>
        <div className={classes.buttonParent}>
          <Button type="submit" className={classes.button}>
            {D.visualize}
          </Button>
        </div>
      </form>
      <br />
      <Helper />
      <AppVersion />
    </Container>
  );
};

export default QuestionnaireForm;
