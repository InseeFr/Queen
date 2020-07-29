import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import { StyleWrapper } from './continue.style';

const Button = ({ readonly, canContinue, isLastComponent, pageNext, finalQuit }) => {
  const lastLabel = readonly ? D.simpleQuit : D.saveAndQuit;
  const pageNextFunction = isLastComponent ? finalQuit : pageNext;
  const getNextLabel = isLastComponent ? lastLabel : D.continueButton;

  const keysToHandle = ['ctrl+enter', 'ctrl+backspace'];

  const keyboardShortcut = (key, e) => {
    if (key === 'ctrl+enter') {
      if (canContinue) pageNextFunction();
    }
  };

  return (
    <>
      <StyleWrapper>
        <div className="continue-button">
          <button
            aria-label={getNextLabel}
            type="button"
            onClick={pageNextFunction}
            disabled={!canContinue && !readonly}
          >
            {getNextLabel}
          </button>
        </div>
      </StyleWrapper>
      <KeyboardEventHandler
        handleKeys={keysToHandle}
        onKeyEvent={keyboardShortcut}
        handleFocusableElements
      />
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
