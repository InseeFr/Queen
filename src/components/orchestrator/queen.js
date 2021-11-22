import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import * as UQ from 'utils/questionnaire';
import { DIRECT_CONTINUE_COMPONENTS } from 'utils/constants';
import Header from './header';
import ContinueButton from './buttons/continue';
import NavBar from './navBar';
import { useCustomLunaticStyles } from './lunaticStyle/style';
import { useStyles } from './orchestrator.style';
import SimpleLoader from 'components/shared/preloader/simple';
import {
  COMPLETED,
  useQuestionnaireState,
  VALIDATED,
  useValidatedPages,
} from 'utils/hook/questionnaire';
import D from 'i18n';
import { Panel } from 'components/designSystem';

export const OrchestratorContext = React.createContext();

const dontKnowButton = (
  <>
    <span className="shortcut">F2</span>
    {D.doesntKnowButton}
    <span className="checked" />
  </>
);

const refusedButton = (
  <>
    <span className="shortcut">F4</span>
    {D.refusalButton}
    <span className="checked" />
  </>
);

const QueenOrchestrator = ({
  lunatic: {
    questionnaire,
    components,
    handleChange,
    bindings,
    pagination: { goNext, goPrevious, page, setPage, isFirstPage, isLastPage, flow, maxPage },
  },
  surveyUnit,
  save,
  close,
  readonly,
  standalone,
  filterDescription,
  preferences,
  features,
  missing,
  pagination,
  savingType,
  calculatedVariables,
}) => {
  const classes = useStyles();
  const topRef = useRef();
  const lunaticClasses = useCustomLunaticStyles();
  const { stateData } = surveyUnit;

  const [changingPage, setChangingPage] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [pendingChangePage, setPendingChangePage] = useState(null);
  const [questionnaireUpdated, setQuestionnaireUpdated] = useState(true);
  const [haveToGoNext, setHaveToGoNext] = useState(false);

  const [queenFlow, setQueenFlow] = useState('next');
  const [rereading, setRereading] = useState(false);

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
      save({
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
    [comment, page, questionnaire, save, state, surveyUnit]
  );

  const changePage = useCallback(
    (type, freshBindings) => {
      setChangingPage(true);
      setQueenFlow(type);
      setPendingChangePage(null);
      setHaveToGoNext(false);
      saveQueen();
      if (type === 'next') {
        addValidatedPages(page);
        goNext(null, freshBindings);
      } else if (type === 'fastForward') {
        goNext();
      } else if (type === 'previous') goPrevious();
      setRereading(false);
    },
    [addValidatedPages, page, goPrevious, goNext, saveQueen]
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
  }, [changeState, close, isLastPage, saveQueen]);

  const definitiveQuit = useCallback(async () => {
    setPendingChangePage(null);
    changeState(VALIDATED);
    await saveQueen(VALIDATED);
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeState, close]);

  const {
    maxLocalPages,
    occurences,
    currentComponent,
    occurencesIndex,
    queenBindings,
    loopBindings: { loopBindings, responseBindings },
    allFirstLoopPages,
  } = UQ.getInfoFromCurrentPage(components, calculatedVariables)(bindings)(page)(maxPage);
  const { componentType: currentComponentType, hierarchy } = currentComponent || {};

  const canGoNext = UQ.canGoNext(currentComponent)(queenBindings);

  useEffect(() => {
    if (
      currentComponent &&
      canGoNext &&
      !rereading &&
      !['Sequence', 'Subsequence'].includes(currentComponentType)
    ) {
      setRereading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rereading]);

  // fastFoward effet
  useEffect(() => {
    if (changingPage) {
      if (queenFlow === 'fastForward' || queenFlow === 'waitingFast') {
        if (currentComponent && canGoNext) {
          changePage('fastForward');
        } else if (currentComponent) {
          setTimeout(() => {
            setQueenFlow('next');
            setChangingPage(false);
          }, 200);
        } else {
          setQueenFlow('waitingFast');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canGoNext, changingPage, currentComponent, goNext, page, queenFlow]);

  useEffect(() => {
    if (!['fastForward', 'waitingFast'].includes(queenFlow) && changingPage) setChangingPage(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /**
   * This function updates the values of the questionnaire responses
   * from the data entered by the user.
   * This function is disabled when app is in readonly mode.
   * @param {*} component the current component
   */
  const onChange = updatedValue => {
    if (!readonly) {
      setQuestionnaireUpdated(false);
      handleChange(updatedValue);
      setQuestionnaireUpdated(true);
      setHaveToGoNext(h => h || UQ.haveToGoNext(currentComponentType, updatedValue));
    }
  };

  useEffect(() => {
    if (!isLastPage && haveToGoNext) {
      setChangingPage(true);
      setTimeout(() => {
        changePage('next');
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveToGoNext, isLastPage, currentComponentType]);

  useEffect(() => {
    if (questionnaireUpdated && pendingChangePage) {
      if (pendingChangePage === 'previous') changePage('previous');
      if (pendingChangePage === 'next') changePage('next');
      if (pendingChangePage === 'fastForward') changePage('fastForward');
      if (pendingChangePage === 'quit') quit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionnaireUpdated, pendingChangePage]);

  const missingStrategy = useCallback(
    b => {
      if (!isLastPage) {
        setChangingPage(true);
        setTimeout(() => {
          changePage('next', b);
        }, 200);
      }
    },
    [changePage, isLastPage]
  );

  const context = useMemo(
    () => ({
      menuOpen,
      setMenuOpen,
      quit,
      definitiveQuit,
      standalone,
      readonly,
      page,
      maxPages: maxLocalPages,
      occurences,
      isFirstPage,
      isLastPage,
      validatedPages,
      questionnaire,
      bindings,
      queenBindings,
    }),
    [
      menuOpen,
      quit,
      definitiveQuit,
      standalone,
      readonly,
      page,
      maxLocalPages,
      occurences,
      isFirstPage,
      isLastPage,
      validatedPages,
      questionnaire,
      bindings,
      queenBindings,
    ]
  );

  const [expanded, setExpanded] = useState(false);

  const handleChangePanel = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <OrchestratorContext.Provider value={context}>
      <div className={classes.root}>
        <Header title={questionnaire.label} hierarchy={hierarchy} setPage={setPage} />
        <div className={classes.bodyContainer}>
          {changingPage && <SimpleLoader />}
          <div className={classes.components} ref={topRef}>
            {components.map(component => {
              const { componentType, id } = component;
              const Component = lunatic[componentType];
              if (componentType !== 'FilterDescription')
                return (
                  <div
                    className={`${lunaticClasses.lunatic} ${currentComponentType}  ${
                      currentComponent?.options && currentComponent?.options.length >= 8
                        ? 'split-fieldset'
                        : ''
                    }`}
                    key={`component-${id}`}
                  >
                    {queenFlow !== 'fastForward' && (
                      <Component
                        {...component}
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
                        missing={missing}
                        missingStrategy={missingStrategy}
                        savingType={savingType}
                        dontKnowButton={dontKnowButton}
                        refusedButton={refusedButton}
                        missingShortcut={{ dontKnow: 'f2', refused: 'f4' }}
                        shortcut={true}
                      />
                    )}
                  </div>
                );
              return null;
            })}
            {loopBindings && (
              <div className={classes.loopInfo}>
                {Object.values(loopBindings).length > 0 &&
                  Object.values(loopBindings)[0].map((_, ind) => {
                    return (
                      <Panel
                        key={`${ind}-panel`}
                        expanded={expanded === ind}
                        currentPanel={ind === occurencesIndex[0]}
                        handleChangePanel={handleChangePanel}
                        index={ind}
                        title={Object.values(loopBindings).map(value => {
                          if (value && value[ind]) return <span>{`${value[ind]} `}</span>;
                          return null;
                        })}
                        variables={Object.entries(responseBindings).reduce((acc, [key, value]) => {
                          return { ...acc, [key]: value[ind] };
                        }, {})}
                        setPage={setPage}
                        goToSeePage={allFirstLoopPages[ind]}
                      />
                    );
                  })}
              </div>
            )}
            {!DIRECT_CONTINUE_COMPONENTS.includes(currentComponentType) &&
              ((canGoNext && !rereading) || isLastPage) && (
                <ContinueButton setPendingChangePage={setPendingChangePage} />
              )}
          </div>
          <NavBar rereading={rereading} setPendingChangePage={setPendingChangePage} />
        </div>
      </div>
    </OrchestratorContext.Provider>
  );
};

QueenOrchestrator.propTypes = {
  surveyUnit: PropTypes.objectOf(PropTypes.any).isRequired,
  lunatic: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(QueenOrchestrator);
