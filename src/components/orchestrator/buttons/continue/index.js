import React, { useEffect, useRef, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import { StyleWrapper } from './continue.style';

const Button = ({ readonly, canContinue, isLastComponent, pageNext, finalQuit }) => {
  const lastLabel = readonly ? D.simpleQuit : D.saveAndQuit;
  const pageNextFunction = isLastComponent ? finalQuit : pageNext;
  const getNextLabel = isLastComponent ? lastLabel : D.continueButton;

  const continueButtonRef = useRef();

  const [changePagePending, setChangePagePending] = useState(null);
  const [focus, setFocus] = useState(false);
  const keysToHandle = ['alt+enter'];

  const keyboardShortcut = (key, e) => {
    e.preventDefault();
    if (key === 'alt+enter' && canContinue) {
      if (continueButtonRef && continueButtonRef.current) {
        setChangePagePending('next');
        continueButtonRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (focus && changePagePending === 'next') {
      setChangePagePending(null);
      pageNextFunction();
    }
  }, [focus, changePagePending, pageNextFunction]);

  const onfocus = value => () => setFocus(value);

  const componentToDisplay = (
    <>
      <StyleWrapper>
        <div className="continue-button">
          <button
            ref={continueButtonRef}
            aria-label={getNextLabel}
            type="button"
            onClick={pageNextFunction}
            onFocus={onfocus(true)}
            onBlur={onfocus(false)}
            disabled={!canContinue && !readonly}
          >
            {`${getNextLabel} ${(!isLastComponent && '\u2192') || ''}`}
          </button>
          <span className="help">{` ${D.helpShortCut} `}</span>
          <span>{D.ctrlEnter}</span>
        </div>
      </StyleWrapper>
      <KeyboardEventHandler
        handleKeys={keysToHandle}
        onKeyEvent={keyboardShortcut}
        handleFocusableElements
      />
    </>
  );

  return (
    <>
      {readonly && isLastComponent && componentToDisplay}
      {!readonly && componentToDisplay}
    </>
  );
};

Button.propTypes = {
  readonly: PropTypes.bool.isRequired,
  canContinue: PropTypes.bool.isRequired,
  isLastComponent: PropTypes.bool.isRequired,
  pageNext: PropTypes.func.isRequired,
  finalQuit: PropTypes.func.isRequired,
};

export default React.memo(Button);
