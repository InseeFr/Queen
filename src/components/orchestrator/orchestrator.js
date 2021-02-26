import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import * as lunatic from '@inseefr/lunatic';
import alphabet from 'utils/constants/alphabet';
import * as UQ from 'utils/questionnaire';
import { DIRECT_CONTINUE_COMPONENTS, KEYBOARD_SHORTCUT_COMPONENTS } from 'utils/constants';
import { sendStartedEvent, sendCompletedEvent } from 'utils/communication';
import Header from './header';
import Buttons from './buttons';
import ContinueButton from './buttons/continue';
import { StyleWrapper } from './orchestrator.style';
import NavBar from './rightNavbar';

const Orchestrator = ({
  surveyUnit,
  standalone,
  readonly,
  savingType,
  preferences,
  features,
  source,
  filterDescription,
  save,
  close,
}) => {
  const { data } = surveyUnit;
  const [menuOpen, setMenuOpen] = useState(false);
  const [started, setStarted] = useState(() => {
    if (data.COLLECTED) {
      return Object.keys(data.COLLECTED).length > 0;
    }
    return false;
  });

  const [pendingChangePage, setPendingChangePage] = useState(null);
  const [questionnaireUpdated, setQuestionnaireUpdated] = useState(true);
  const [changedOnce, setChangedOnce] = useState(false);

  const { questionnaire, components, handleChange, bindings } = lunatic.useLunatic(source, data, {
    savingType,
    preferences,
    features,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [comment /* , setComment */] = useState(surveyUnit.comment);
  const [validatePages, setValidatePages] = useState(() => {
    const page = UQ.getFirstTitlePageBeforeFastForwardPage(questionnaire)(bindings);
    return page >= 1 ? Array.from(Array(page - 1), (_, i) => i + 1) : [];
  });

  const addValidatePage = useCallback(() => {
    let newValidatePages = validatePages;
    if (!validatePages.includes(currentPage)) {
      newValidatePages = [...newValidatePages, currentPage];
      setValidatePages(newValidatePages);
    }
    return newValidatePages;
  }, [currentPage, validatePages, setValidatePages]);

  const filteredComponents = components.filter(c => c.page);

  const component = filteredComponents.find(({ page }) => page === currentPage);
  const { id, componentType, sequence, subsequence, options, responses, ...props } = component;
  // get specialAnswer from component (specified in Pogues)
  // to wait, set to false by default
  // const specialAnswer = { refusal: false, doesntKnow: false };

  const pageFilter = UQ.findPageIndex(filteredComponents)(currentPage);
  const isLastComponent = filteredComponents.length - 1 === pageFilter;
  /**
   *  This function update response values in questionnaire.
   *  At the end, it calls the saving method of its parent (saving into indexdb)
   */
  const saveQueen = useCallback(async () => {
    const dataToSave = UQ.getStateToSave(questionnaire);
    await save({ ...surveyUnit, data: dataToSave, comment });
  }, [comment, save, surveyUnit, questionnaire]);

  /**
   * @return boolean if user can continue to the next page.
   * (manage "refusal" and "doesn't know" response)
   */
  const goNextCondition = () => {
    return true;
  };

  const goPrevious = () => {
    setChangedOnce(false);
    setPendingChangePage(null);
    setCurrentPage(UQ.getPreviousPage(filteredComponents)(currentPage));
  };

  const goNext = useCallback(async () => {
    saveQueen();
    const nextPage = UQ.getNextPage(filteredComponents)(currentPage);
    addValidatePage();
    setPendingChangePage(null);
    setChangedOnce(false);
    setCurrentPage(nextPage);
  }, [filteredComponents, saveQueen, addValidatePage, currentPage]);

  const goFastForward = useCallback(() => {
    saveQueen();
    const newValidatePages = addValidatePage();
    const filteredPage = filteredComponents.map(({ page }) => page);
    const reachesValidatePage = filteredPage.filter(p => newValidatePages.includes(p));
    const reachesNotValidatePage = filteredPage.filter(p => !newValidatePages.includes(p));
    const pageOfLastComponentToValidate =
      reachesNotValidatePage[0] ||
      UQ.getNextPage(filteredComponents)(Math.max(...reachesValidatePage));
    setPendingChangePage(null);
    setChangedOnce(false);
    setCurrentPage(pageOfLastComponentToValidate);
  }, [saveQueen, addValidatePage, filteredComponents]);

  useEffect(() => {
    const start = async () => {
      setStarted(true);
      await sendStartedEvent(surveyUnit.id);
    };
    if (!started && !standalone && validatePages.length > 0) start();
  }, [validatePages, started, standalone, surveyUnit.id]);

  const quit = useCallback(async () => {
    await saveQueen();
    if (isLastComponent && !standalone) await sendCompletedEvent(surveyUnit.id);
    setPendingChangePage(null);
    close();
  }, [saveQueen, isLastComponent, standalone, surveyUnit.id, close]);

  /**
   * This function updates the values of the questionnaire responses
   * from the data entered by the user.
   * This function is disabled when app is in readonly mode.
   * @param {*} component the current component
   */
  const onChange = async updatedValue => {
    if (!readonly) {
      setQuestionnaireUpdated(false);
      await handleChange(updatedValue);
      setQuestionnaireUpdated(true);
      setChangedOnce(true);
    }
  };
  useEffect(() => {
    if (!isLastComponent && DIRECT_CONTINUE_COMPONENTS.includes(componentType)) {
      if (changedOnce) {
        setTimeout(() => {
          goNext();
        }, 100);
      }
    }
  }, [questionnaire, changedOnce, isLastComponent, componentType, goNext]);

  useEffect(() => {
    if (questionnaireUpdated && pendingChangePage) {
      if (pendingChangePage === 'next') goNext();
      if (pendingChangePage === 'fastForward') goFastForward();
      if (pendingChangePage === 'quit') quit();
    }
  }, [questionnaireUpdated, pendingChangePage, goNext, goFastForward, quit]);

  const Component = lunatic[componentType];

  const keyToHandle = UQ.getKeyToHandle(responses, options);

  return (
    <StyleWrapper>
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        standalone={standalone}
        title={questionnaire.label}
        quit={quit}
        sequence={sequence}
        subsequence={subsequence}
        questionnaire={questionnaire}
        bindings={bindings}
        setPage={setCurrentPage}
        validatePages={validatePages}
      />
      <div className="body-container">
        <div className="components">
          <div
            className={`lunatic lunatic-component ${
              options && options.length >= 8 ? 'split-fieldset' : ''
            }`}
            key={`component-${id}`}
          >
            <Component
              id={id}
              {...props}
              options={options}
              responses={responses}
              handleChange={onChange}
              labelPosition="TOP"
              unitPosition="AFTER"
              preferences={preferences}
              features={features}
              bindings={bindings}
              filterDescription={filterDescription}
              writable
              readOnly={readonly}
              disabled={readonly}
              focused
              keyboardSelection={
                componentType === 'CheckboxGroup' || componentType === 'CheckboxOne'
              }
            />
          </div>
          {(!DIRECT_CONTINUE_COMPONENTS.includes(componentType) || readonly) &&
            (!validatePages.includes(currentPage) || isLastComponent) && (
              <ContinueButton
                readonly={readonly}
                canContinue={goNextCondition()}
                isLastComponent={isLastComponent}
                page={pageFilter}
                setPendingChangePage={setPendingChangePage}
              />
            )}
        </div>
        <NavBar nbModules={questionnaire.components.filter(c => c.page).length} page={currentPage}>
          <Buttons
            readonly={readonly}
            rereading={validatePages.includes(currentPage)}
            page={pageFilter}
            canContinue={goNextCondition()}
            isLastComponent={isLastComponent}
            pagePrevious={goPrevious}
            setPendingChangePage={setPendingChangePage}
          />
        </NavBar>

        {KEYBOARD_SHORTCUT_COMPONENTS.includes(componentType) && (
          <KeyboardEventHandler
            handleKeys={keyToHandle}
            onKeyEvent={(key, e) => {
              e.preventDefault();
              const responsesName = UQ.getResponsesNameFromComponent(component);
              const responsesCollected = UQ.getCollectedResponse(questionnaire)(component);
              const updatedValue = {};
              if (componentType === 'CheckboxOne') {
                const index =
                  (options.length < 10
                    ? key
                    : alphabet.findIndex(l => l.toLowerCase() === key.toLowerCase()) + 1) - 1;
                if (index >= 0 && index < options.length) {
                  updatedValue[responsesName[0]] = options[index].value;
                  onChange(updatedValue);
                }
              } else if (componentType === 'CheckboxGroup') {
                const index =
                  (responsesName.length < 10
                    ? key
                    : alphabet.findIndex(l => l.toLowerCase() === key.toLowerCase()) + 1) - 1;

                if (index >= 0 && index < responsesName.length) {
                  updatedValue[responsesName[index]] = !responsesCollected[responsesName[index]];
                  onChange(updatedValue);
                }
              }
            }}
            handleFocusableElements
          />
        )}
      </div>
    </StyleWrapper>
  );
};

Orchestrator.propTypes = {
  surveyUnit: PropTypes.objectOf(PropTypes.any).isRequired,
  standalone: PropTypes.bool.isRequired,
  readonly: PropTypes.bool.isRequired,
  savingType: PropTypes.oneOf(['COLLECTED', 'FORCED', 'EDITED']).isRequired,
  preferences: PropTypes.arrayOf(PropTypes.string).isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterDescription: PropTypes.bool.isRequired,
  source: PropTypes.objectOf(PropTypes.any).isRequired,
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default React.memo(Orchestrator);
