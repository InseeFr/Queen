import { Accordion, AccordionDetails, AccordionSummary, makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React from 'react';
import { Button } from './Button';

const useStyles = makeStyles(theme => ({
  root: {
    width: '20%',
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  summary: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
    details: {
      padding: theme.spacing(2),
      backgroundColor: 'rgba(0, 0, 0, .03)',
    },
  },
}));

// TODO : get Page to go

export const Panel = ({ index, expanded, handleChangePanel, title, variables, setPage }) => {
  const classes = useStyles();
  return (
    <Accordion expanded={expanded} onChange={handleChangePanel(index)} className={classes.root}>
      <AccordionSummary className={classes.summary} expandIcon={<ExpandMore />}>
        {title}
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {Object.entries(variables).map(([key, value]) => {
          if (value)
            return (
              <span>
                <b>{`${key}:`}</b>
                {value}
              </span>
            );
          return null;
        })}
        <Button onClick={() => setPage()}>Aller voir</Button>
      </AccordionDetails>
    </Accordion>
  );
};
