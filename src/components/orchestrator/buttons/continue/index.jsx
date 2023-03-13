import React, { useContext, useEffect, useRef, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ArrowRightAlt } from '@material-ui/icons';
import { Button } from 'components/designSystem';
import PropTypes from 'prop-types';
import D from 'i18n';
import { useStyles } from './continue.style';
import { OrchestratorContext } from 'components/orchestrator/queen';

const ButtonContinue = ({ setPendingChangePage }) => {
  const { readonly, isLastPage, page } = useContext(OrchestratorContext);
  const classes = useStyles();

  const lastLabel = readonly ? D.simpleQuit : D.saveAndQuit;
  const getNextLabel = isLastPage ? lastLabel : D.continueButton;

  const continueButtonRef = useRef();

  const [pageChanging, setPageChanging] = useState(null);

  const localPageNext = () => setPageChanging('next');
  const localFinalQuit = () => setPageChanging('quit');

  const pageNextFunction = isLastPage ? localFinalQuit : localPageNext;

  const [focus, setFocus] = useState(false);
  const onfocus = value => () => setFocus(value);

  useEffect(() => {
    setPageChanging(false);
  }, [page]);

  const keysToHandle = ['alt+enter'];

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'alt+enter') {
      if (continueButtonRef && continueButtonRef.current) {
        continueButtonRef.current.focus();
        pageNextFunction();
      }
    }
  };

  useEffect(() => {
    if (focus && pageChanging) {
      setPendingChangePage(pageChanging);
    }
  }, [focus, pageChanging, setPendingChangePage]);

  const componentToDisplay = (
    <div className={classes.wrapperButton}>
      <Button
        ref={continueButtonRef}
        aria-label={getNextLabel}
        type="button"
        onClick={pageNextFunction}
        onFocus={onfocus(true)}
        onBlur={onfocus(false)}
        disabled={readonly}
        endIcon={!isLastPage && <ArrowRightAlt />}
      >
        {getNextLabel}
      </Button>
      <span className={classes.help}>{` ${D.helpShortCut} `}</span>
      <span className={classes.labelHelp}>{D.ctrlEnter}</span>
      <KeyboardEventHandler
        handleKeys={keysToHandle}
        onKeyEvent={keyboardShortcut}
        handleFocusableElements
      />
    </div>
  );

  return (
    <>
      {readonly && isLastPage && componentToDisplay}
      {!readonly && componentToDisplay}
    </>
  );
};

ButtonContinue.propTypes = {
  setPendingChangePage: PropTypes.func.isRequired,
};

export default React.memo(ButtonContinue);
