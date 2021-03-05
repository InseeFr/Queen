import React, { useEffect, useRef, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ArrowRightAlt } from '@material-ui/icons';
import { Button } from 'components/designSystem';
import PropTypes from 'prop-types';
import D from 'i18n';
import { StyleWrapper } from './continue.style';

const ButtonContinue = ({ readonly, canContinue, isLastComponent, page, setPendingChangePage }) => {
  const lastLabel = readonly ? D.simpleQuit : D.saveAndQuit;
  const getNextLabel = isLastComponent ? lastLabel : D.continueButton;

  const rootRef = useRef(null);

  const continueButtonRef = useRef();

  const [pageChanging, setPageChanging] = useState(null);

  const localPageNext = () => setPageChanging('next');
  const localFinalQuit = () => setPageChanging('quit');

  const pageNextFunction = isLastComponent ? localFinalQuit : localPageNext;

  const [focus, setFocus] = useState(false);
  const onfocus = value => () => setFocus(value);

  useEffect(() => {
    setPageChanging(false);
  }, [page]);

  const keysToHandle = ['alt+enter'];

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'alt+enter' && canContinue) {
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
    <div ref={rootRef}>
      <StyleWrapper>
        <div className="continue-button">
          <Button
            ref={continueButtonRef}
            aria-label={getNextLabel}
            type="button"
            onClick={pageNextFunction}
            onFocus={onfocus(true)}
            onBlur={onfocus(false)}
            disabled={!canContinue && !readonly}
            endIcon={!isLastComponent && <ArrowRightAlt />}
          >
            {getNextLabel}
          </Button>
          <span className="help">{` ${D.helpShortCut} `}</span>
          <span>{D.ctrlEnter}</span>
        </div>
      </StyleWrapper>
      <KeyboardEventHandler
        handleKeys={keysToHandle}
        onKeyEvent={keyboardShortcut}
        handleFocusableElements
      />
    </div>
  );

  return (
    <>
      {readonly && isLastComponent && componentToDisplay}
      {!readonly && componentToDisplay}
    </>
  );
};

ButtonContinue.propTypes = {
  readonly: PropTypes.bool.isRequired,
  canContinue: PropTypes.bool.isRequired,
  isLastComponent: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  setPendingChangePage: PropTypes.func.isRequired,
};

export default React.memo(ButtonContinue);
