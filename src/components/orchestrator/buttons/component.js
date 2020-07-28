import React, { useState, useEffect } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import PropTypes from 'prop-types';
import D from 'i18n';
import { DIRECT_CONTINUE_COMPONENTS, REFUSAL, DOESNT_KNOW, QUEEN_DATA_KEYS } from 'utils/constants';
import {
  getResponsesNameFromComponent,
  addResponseToSpecialQueenData,
  isInSpecialQueenDataRefusal,
  isInSpecialQueenDataDoesntKnow,
} from 'utils/questionnaire';
import { StyleWrapper } from './component.style';

const Buttons = ({
  readonly,
  rereading,
  currentComponent,
  specialAnswer,
  page,
  specialQueenData,
  canContinue,
  isLastComponent,
  pagePrevious,
  pageNext,
  pageFastForward,
  finalQuit,
}) => {
  const { componentType } = currentComponent;
  const returnLabel = page === 0 ? '' : D.goBackReturn;
  const lastLabel = readonly ? D.simpleQuit : D.saveAndQuit;
  const getNextLabel = () => {
    if (isLastComponent) return lastLabel;
    if (rereading) return `${D.nextButton}`;
    return D.continueButton;
  };
  const getNextButtonLabel = () => {
    if (isLastComponent) return lastLabel;
    if (rereading) return `${D.nextButtonLabel}`;
    return `${D.continueButtonLabel} \u2192`;
  };
  const nextLabel = getNextLabel();
  const pageNextFunction = isLastComponent ? finalQuit : pageNext;

  const [refusalChecked, setRefusalChecked] = useState(false);
  const [doesntKnowChecked, setDoesntKnowChecked] = useState(false);

  // const keysToHandle = ['Sequence', 'Subsequence'].includes(componentType)
  //   ? ['enter']
  //   : ['f2', 'f4', 'enter'];
  const keysToHandle = ['ctrl+enter', 'ctrl+backspace'];

  useEffect(() => {
    setRefusalChecked(false);
    setDoesntKnowChecked(false);
  }, [currentComponent]);

  useEffect(() => {
    const responseNames = getResponsesNameFromComponent(currentComponent);
    if (responseNames) {
      if (isInSpecialQueenDataRefusal(specialQueenData)(responseNames)) {
        setRefusalChecked(true);
        setDoesntKnowChecked(false);
      } else if (isInSpecialQueenDataDoesntKnow(specialQueenData)(responseNames)) {
        setRefusalChecked(false);
        setDoesntKnowChecked(true);
      } else {
        setRefusalChecked(false);
        setDoesntKnowChecked(false);
      }
    }
  }, [page, specialQueenData, currentComponent]);

  const setSpecialAnswer = specialType => {
    let newSpecialQueenData = { ...specialQueenData };
    if (QUEEN_DATA_KEYS.includes(specialType)) {
      const responseNames = getResponsesNameFromComponent(currentComponent);
      responseNames.forEach(name => {
        newSpecialQueenData = addResponseToSpecialQueenData(specialQueenData)(name)(specialType);
      });
    }
    return newSpecialQueenData;
  };

  const getSpecialAnswerType = () => {
    if (refusalChecked) return REFUSAL;
    if (doesntKnowChecked) return DOESNT_KNOW;
    return null;
  };

  /**
   * This function changes the current page
   * @param {Function} func : function to apply
   * @param {String} specialAnswerType : the type of specialAnswer (REFUSAL or DOESNT_KNOW)
   */
  const pageChange = (func, specialAnswerType) => {
    const newSpecialQueenData = setSpecialAnswer(specialAnswerType || getSpecialAnswerType());
    func(newSpecialQueenData);
  };

  const updateRefusal = () => {
    if (DIRECT_CONTINUE_COMPONENTS.includes(componentType)) {
      pageChange(pageNextFunction, REFUSAL);
    } else if (doesntKnowChecked) setDoesntKnowChecked(false);
    setRefusalChecked(!refusalChecked);
  };

  const updateDoesntKnow = () => {
    if (DIRECT_CONTINUE_COMPONENTS.includes(componentType)) {
      pageChange(pageNextFunction, DOESNT_KNOW);
    } else if (refusalChecked) setRefusalChecked(false);
    setDoesntKnowChecked(!doesntKnowChecked);
  };

  const keyboardShortcut = (key, e) => {
    if (key === 'ctrl+enter') {
      if (canContinue || refusalChecked || doesntKnowChecked) pageChange(pageNextFunction);
    }
    if (key === 'ctrl+backspace') pageChange(pagePrevious);
    // if (key === 'f2') updateDoesntKnow();
    // if (key === 'f4') updateRefusal();
    // if (key === 'enter') {
    //   if (canContinue || refusalChecked || doesntKnowChecked) pageChange(pageNextFunction);
    // }
  };

  return (
    <>
      <StyleWrapper id="buttons" className={!returnLabel && 'btn-alone'}>
        {!['Sequence', 'Subsequence'].includes(componentType) && (
          <>
            {specialAnswer.doesntKnow && (
              <button
                type="button"
                className={`doesntknow specific-modality ${
                  doesntKnowChecked ? 'content-checked' : ''
                }`}
                onClick={updateDoesntKnow}
              >
                <span className="shortcut">F2</span>
                {D.doesntKnowButton}
                <span className="checked">{doesntKnowChecked ? '✓' : ''}</span>
              </button>
            )}
            {specialAnswer.refusal && (
              <button
                type="button"
                className={`refusal specific-modality ${refusalChecked ? 'content-checked' : ''}`}
                onClick={updateRefusal}
              >
                <span className="shortcut">F4</span>
                {D.refusalButton}
                <span className="checked">{refusalChecked ? '✓' : ''}</span>
              </button>
            )}
          </>
        )}
        {returnLabel && (
          <div className="short-button navigation">
            <button
              className="navigation-button short"
              type="button"
              onClick={() => pageChange(pagePrevious)}
            >
              {`\u25C0`}
            </button>
            <span>{D.goBackReturn}</span>
          </div>
        )}
        {(!DIRECT_CONTINUE_COMPONENTS.includes(componentType) ||
          isLastComponent ||
          readonly ||
          rereading) && (
          <div className="short-button next navigation">
            <button
              aria-label={getNextButtonLabel()}
              className="navigation-button short"
              type="button"
              onClick={() => pageChange(pageNextFunction)}
              disabled={!canContinue && !refusalChecked && !doesntKnowChecked && !readonly}
            >
              {`\u25B6`}
            </button>
            <span>{nextLabel}</span>
          </div>
        )}
        <div className="fast-button navigation">
          <button
            className="navigation-button"
            type="button"
            onClick={() => pageChange(pageFastForward)}
          >
            {`${D.fastForward} \u21E5`}
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

Buttons.propTypes = {
  readonly: PropTypes.bool.isRequired,
  rereading: PropTypes.bool.isRequired,
  currentComponent: PropTypes.objectOf(PropTypes.any).isRequired,
  specialAnswer: PropTypes.shape({
    refusal: PropTypes.bool.isRequired,
    doesntKnow: PropTypes.bool.isRequired,
  }).isRequired,
  page: PropTypes.number.isRequired,
  specialQueenData: PropTypes.objectOf(PropTypes.any).isRequired,
  canContinue: PropTypes.bool.isRequired,
  isLastComponent: PropTypes.bool.isRequired,
  pageNext: PropTypes.func.isRequired,
  pagePrevious: PropTypes.func.isRequired,
  pageFastForward: PropTypes.func.isRequired,
  finalQuit: PropTypes.func.isRequired,
};

export default React.memo(Buttons);
