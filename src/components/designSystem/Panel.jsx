import { Accordion, AccordionDetails, AccordionSummary, makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import Dictionary from 'i18n';
import React, { useEffect, useState } from 'react';
import { Button } from './Button';

const useStyles = currentPanel =>
  makeStyles(theme => ({
    root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      marginTop: '13px',
      backgroundColor: currentPanel ? '#455a79' : '#cccccc',
      color: currentPanel ? 'white' : '#455a79',
    },
    summary: {
      backgroundColor: 'rgba(0, 0, 0, .03)',
      borderBottom: currentPanel ? '1px solid white' : '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
      },
      '& span': {
        marginRight: '0.5em',
        color: currentPanel ? 'white' : '#455a79',
      },
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    details: {
      display: 'block',
      padding: theme.spacing(1),
      backgroundColor: 'rgba(0, 0, 0, .03)',
    },
    item: { padding: theme.spacing(0.5) },
    itemKey: { fontSize: 'small' },
    button: { marginTop: '1em' },
    action: { textAlign: 'center' },
  }));

// TODO : get Page to go

export const Panel = ({
  index,
  expanded,
  currentPanel,
  handleChangePanel,
  title,
  variables,
  setPage,
  goToSeePage,
}) => {
  const classes = useStyles(currentPanel)();

  const [localExpanded, setLocalExpanded] = useState(currentPanel);

  const localHandleChange = (event, newExpanded) => {
    setLocalExpanded(newExpanded);
    handleChangePanel(index)(event, newExpanded);
  };

  useEffect(() => {
    setLocalExpanded(expanded);
  }, [expanded]);

  useEffect(() => {
    setLocalExpanded(currentPanel);
  }, [currentPanel]);

  const isNothingToDisplay = vars =>
    Object.entries(variables).filter(([key, value]) => !!value).length === 0;

  const emptyData = isNothingToDisplay(variables);

  return (
    <Accordion expanded={localExpanded} onChange={localHandleChange} className={classes.root}>
      <AccordionSummary className={classes.summary} expandIcon={<ExpandMore />}>
        {title}
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        {emptyData && <div classNam={classes.details}>{Dictionary.noDataCollected}</div>}
        {!emptyData &&
          Object.entries(variables).map(([key, value]) => {
            if (value)
              return (
                <div className={classes.item}>
                  <div className={classes.itemKey}>{`${key}: `}</div>
                  <div>
                    <b>{`${value}`}</b>
                  </div>
                </div>
              );
            return null;
          })}

        {!currentPanel && !emptyData && (
          <div className={classes.action}>
            <Button className={classes.button} onClick={() => setPage(goToSeePage)}>
              {Dictionary.goSeeItButton}
            </Button>
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
