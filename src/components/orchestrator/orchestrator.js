import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import * as lunatic from '@inseefr/lunatic';
import alphabet from 'utils/constants/alphabet';
import * as UQ from 'utils/questionnaire';
import { DIRECT_CONTINUE_COMPONENTS, KEYBOARD_SHORTCUT_COMPONENTS } from 'utils/constants';
import Header from './header';
import Buttons from './buttons';
import ContinueButton from './buttons/continue';
import NavBar from './rightNavbar';
import { useCustomLunaticStyles } from './lunaticStyle/style';
import { useStyles } from './orchestrator.style';
import SimpleLoader from 'components/shared/preloader/simple';
import {
  COMPLETED,
  useQuestionnaireState,
  VALIDATED,
  useValidatedPages,
} from 'utils/hook/questionnaire';

export const OrchestratorContext = React.createContext();

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
  const { data, stateData } = surveyUnit;
  const [changingPage, setChangingPage] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const [state, changeState] = useQuestionnaireState(
    questionnaire,
    stateData?.state,
    surveyUnit?.id
  );
  const [validatedPages, addValidatedPages] = useValidatedPages(
    stateData?.currentPage,
    questionnaire,
    bindings
  );

  const [comment /* , setComment */] = useState(surveyUnit.comment);

  const saveQueen = useCallback(
    async lastState => {
      await save({
        ...surveyUnit,
        stateData: {
          state: lastState ? lastState : state,
          date: new Date().getTime(),
          currentPage: page,
        },
        data: UQ.getStateToSave(questionnaire),
        comment: comment,
      });
    },
    [questionnaire, save, surveyUnit, state, page, comment]
  );

  useEffect(() => {
    if (queenFlow === 'fastForward') {
      setQueenFlow('next');
      goNext();
    }
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
        addValidatedPages(page);
        goNext();
      } else if (type === 'fastForward') {
        const pageOfLastComponentToValidate = UQ.getMaxValidatedPage(addValidatedPages(page));
        setPage(pageOfLastComponentToValidate);
      } else if (type === 'previous') goPrevious();
    },
    [addValidatedPages, page, goNext, goPrevious, saveQueen, setPage]
  );

  const quit = useCallback(async () => {
    setPendingChangePage(null);
    if (isLastPage) {
      // TODO : make algo to calculate COMPLETED event
      changeState(COMPLETED);
      changeState(VALIDATED);
      await saveQueen(VALIDATED);
    } else await saveQueen();
    close();
  }, [saveQueen, isLastPage, changeState, close]);

  const definitiveQuit = useCallback(async () => {
    setPendingChangePage(null);
    changeState(VALIDATED);
    await saveQueen(VALIDATED);
    close();
  }, [saveQueen, changeState, close]);

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

  const context = {
    menuOpen: menuOpen,
    setMenuOpen: setMenuOpen,
    quit: quit,
    definitiveQuit: definitiveQuit,
    standalone: standalone,
    readonly: readonly,
    page: page,
    maxPages: maxLocalPages,
    occurences: occurences,
    isFirstPage: isFirstPage,
    isLastPage: isLastPage,
    validatedPages: validatedPages,
    questionnaire: questionnaire,
    bindings: bindings,
  };

  return (
    <OrchestratorContext.Provider value={context}>
      <div className={classes.root}>
        <Header title={questionnaire.label} quit={quit} hierarchy={hierarchy} setPage={setPage} />
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
                    className={`${lunaticClasses.lunatic} ${currentComponentType}  ${
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
                      focused
                      readOnly={readonly}
                      disabled={readonly}
                      keyboardSelection={true}
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
                          if (componentType === 'CheckboxOne' || componentType === 'Radio') {
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
              (!validatedPages.includes(page) || isLastPage) && (
                <ContinueButton setPendingChangePage={setPendingChangePage} />
              )}
          </div>

          <NavBar>
            <Buttons
              rereading={validatedPages.includes(page)}
              setPendingChangePage={setPendingChangePage}
            />
          </NavBar>
        </div>
      </div>
    </OrchestratorContext.Provider>
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
