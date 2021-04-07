import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import NavBar from './rightNavbar';
import { useCustomLunaticStyles } from './lunaticStyle/style';
import { useStyles } from './orchestrator.style';
import { Backdrop, CircularProgress } from '@material-ui/core';
import SimpleLoader from 'components/shared/preloader/simple';

const Orchestrator = ({
  surveyUnit,
  standalone,
  readonly,
  savingType,
  preferences,
  pagination,
  features,
  source,
  filterDescription,
  save,
  close,
}) => {
  const classes = useStyles();
  const topRef = useRef();
  const lunaticClasses = useCustomLunaticStyles();
  const { data } = surveyUnit;
  const [changingPage, setChangingPage] = useState(false);
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

  const [queenFlow, setQueenFlow] = useState('next');

  const {
    questionnaire,
    components,
    handleChange,
    bindings,
    pagination: { goNext, goPrevious, page, setPage, isFirstPage, isLastPage, flow, maxPage },
  } = lunatic.useLunatic(source, data, {
    savingType,
    preferences,
    features,
    pagination,
  });

  const [currentPage, setCurrentPage] = useState('1');

  const [comment /* , setComment */] = useState(surveyUnit.comment);
  const [validatePages, setValidatePages] = useState([]);

  const addValidatePage = useCallback(() => {
    let newValidatePages = validatePages;
    if (!validatePages.includes(currentPage)) {
      newValidatePages = [...newValidatePages, currentPage];
      setValidatePages(newValidatePages);
    }
    return newValidatePages;
  }, [currentPage, validatePages, setValidatePages]);

  const saveQueen = useCallback(async () => {
    const dataToSave = UQ.getStateToSave(questionnaire);
    await save({ ...surveyUnit, data: dataToSave, comment });
  }, [comment, save, surveyUnit, questionnaire]);

  const goToTop = () => {
    if (topRef && topRef.current) {
      topRef.current.tabIndex = -1;
      topRef.current.focus();
      topRef.current.blur();
      window.scrollTo({ top: 0 });
      topRef.current.removeAttribute('tabindex');
    }
  };

  useEffect(() => {
    if (queenFlow === 'fastForward') {
      setQueenFlow('next');
      goNext();
    }
    setCurrentPage(page);
    goToTop();
    setChangingPage(false);
    // assume, we don't want to goNext each time goNext is updated, only the first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queenFlow]);

  const changePage = useCallback(
    type => {
      setChangingPage(true);
      setQueenFlow(type);
      setPendingChangePage(null);
      setChangedOnce(false);
      saveQueen();
      if (type === 'next') {
        addValidatePage();
        goNext();
      } else if (type === 'fastForward') {
        const pageOfLastComponentToValidate = UQ.getMaxValidatedPage(addValidatePage());
        setPage(pageOfLastComponentToValidate);
      } else if (type === 'previous') goPrevious();
    },
    [addValidatePage, goNext, goPrevious, saveQueen, setPage]
  );
  useEffect(() => {
    const start = async () => {
      setStarted(true);
      await sendStartedEvent(surveyUnit.id);
    };
    if (!started && !standalone && validatePages.length > 0) start();
  }, [validatePages, started, standalone, surveyUnit.id]);

  const quit = useCallback(async () => {
    await saveQueen();
    if (isLastPage && !standalone) await sendCompletedEvent(surveyUnit.id);
    setPendingChangePage(null);
    close();
  }, [saveQueen, isLastPage, standalone, surveyUnit.id, close]);

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

  const { maxLocalPages, occurences, currentComponent } = UQ.getInfoFromCurrentPage(components)(
    bindings
  )(page)(maxPage);
  const { componentType: currentComponentType, hierarchy } = currentComponent || {};

  useEffect(() => {
    if (!isLastPage && DIRECT_CONTINUE_COMPONENTS.includes(currentComponentType) && changedOnce) {
      setChangingPage(true);
      setTimeout(() => {
        changePage('next');
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionnaire, changedOnce, isLastPage, currentComponentType]);

  useEffect(() => {
    if (questionnaireUpdated && pendingChangePage) {
      if (pendingChangePage === 'previous') changePage('previous');
      if (pendingChangePage === 'next') changePage('next');
      if (pendingChangePage === 'fastForward') changePage('fastForward');
      if (pendingChangePage === 'quit') quit();
    }
  }, [questionnaireUpdated, pendingChangePage, changePage, quit]);

  return (
    <div className={classes.root}>
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        standalone={standalone}
        title={questionnaire.label}
        quit={quit}
        page={page}
        hierarchy={hierarchy}
        questionnaire={questionnaire}
        bindings={bindings}
        setPage={setPage}
        validatePages={validatePages}
      />
      <div className={classes.bodyContainer}>
        {changingPage && <SimpleLoader />}

        <div className={classes.components} ref={topRef}>
          {components.map(component => {
            const { id, componentType, options, responses } = component;
            const keyToHandle = UQ.getKeyToHandle(responses, options);
            const Component = lunatic[componentType];
            if (componentType !== 'FilterDescription')
              return (
                <div
                  className={`${lunaticClasses.lunatic} lunatic lunatic-component ${
                    options && options.length >= 8 ? 'split-fieldset' : ''
                  }`}
                  key={`component-${id}`}
                >
                  <Component
                    {...component}
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
                    keyboardSelection={
                      componentType === 'CheckboxGroup' || componentType === 'CheckboxOne'
                    }
                    currentPage={page}
                    setPage={setPage}
                    flow={flow}
                    pagination={pagination}
                  />
                  {KEYBOARD_SHORTCUT_COMPONENTS.includes(componentType) && (
                    <KeyboardEventHandler
                      handleKeys={keyToHandle}
                      onKeyEvent={(key, e) => {
                        e.preventDefault();
                        const responsesName = UQ.getResponsesNameFromComponent(component);
                        const responsesCollected = UQ.getCollectedResponse(questionnaire)(
                          component
                        );
                        const updatedValue = {};
                        if (componentType === 'CheckboxOne') {
                          const index =
                            (options.length < 10
                              ? key
                              : alphabet.findIndex(l => l.toLowerCase() === key.toLowerCase()) +
                                1) - 1;
                          if (index >= 0 && index < options.length) {
                            updatedValue[responsesName[0]] = options[index].value;
                            onChange(updatedValue);
                          }
                        } else if (componentType === 'CheckboxGroup') {
                          const index =
                            (responsesName.length < 10
                              ? key
                              : alphabet.findIndex(l => l.toLowerCase() === key.toLowerCase()) +
                                1) - 1;
                          if (index >= 0 && index < responsesName.length) {
                            updatedValue[responsesName[index]] = !responsesCollected[
                              responsesName[index]
                            ];
                            onChange(updatedValue);
                          }
                        }
                      }}
                      handleFocusableElements
                    />
                  )}
                </div>
              );
            return null;
          })}
          {(!DIRECT_CONTINUE_COMPONENTS.includes(currentComponentType) || readonly) &&
            (!validatePages.includes(currentPage) || isLastPage) && (
              <ContinueButton
                readonly={readonly}
                isLastComponent={isLastPage}
                page={page}
                setPendingChangePage={setPendingChangePage}
              />
            )}
        </div>

        <NavBar page={currentPage} maxPages={maxLocalPages} occurences={occurences}>
          <Buttons
            readonly={readonly}
            rereading={validatePages.includes(page)}
            page={page}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
            setPendingChangePage={setPendingChangePage}
          />
        </NavBar>
      </div>
    </div>
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
