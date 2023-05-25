import * as UQ from 'utils/questionnaire';
import * as lunatic from '@inseefr/lunatic';

import {
  COMPLETED,
  VALIDATED,
  useQuestionnaireState,
  useValidatedPages,
} from 'utils/hook/questionnaire';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ContinueButton from './buttons/continue';
import D from 'i18n';
import { DIRECT_CONTINUE_COMPONENTS } from 'utils/constants';
import Header from './header';
import NavBar from './navBar';
import { Panel } from 'components/designSystem';
import PropTypes from 'prop-types';
import SimpleLoader from 'components/shared/preloader/simple';
import { useCustomLunaticStyles } from './lunaticStyle/style';
import { useStyles } from './orchestrator.style';

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
    allBindings,
    state: { getState },
    pagination: { goNext, goPrevious, page, setPage, isFirstPage, isLastPage, flow, maxPage },
  },
  surveyUnit,
  source,
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

  const [pageFastfoward, setPageFastFoward] = useState(null);

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
        data: getState(questionnaire),
        comment: comment,
      });
    },
    [comment, getState, page, save, questionnaire, state, surveyUnit]
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
  } = UQ.getInfoFromCurrentPage(components, calculatedVariables)(allBindings)(page)(maxPage);
  const { componentType: currentComponentType, hierarchy } = currentComponent || {};

  const canGoNext = UQ.canGoNext(currentComponent)(queenBindings);

  useEffect(() => {
    if (
      currentComponentType &&
      !rereading &&
      !['Sequence', 'Subsequence'].includes(currentComponentType) &&
      queenFlow !== 'fastForward'
    ) {
      setRereading(canGoNext);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rereading]);

  // fastFoward effect
  useEffect(() => {
    if (
      changingPage && // only if page is changing
      queenFlow === 'fastForward' && // only during the fastFoward flow
      page !== pageFastfoward // only if page has changed after goNext effect
    ) {
      if (canGoNext && page !== maxPage) {
        setPageFastFoward(page);
        goNext();
      } else {
        setPageFastFoward(null);
        setQueenFlow(null);
        setChangingPage(false);
      }
    }
  }, [canGoNext, changingPage, goNext, maxPage, page, pageFastfoward, queenFlow]);

  useEffect(() => {
    if (queenFlow !== 'fastForward' && changingPage) setChangingPage(false);
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
      setPendingChangePage('next');
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
  }, [questionnaireUpdated, pendingChangePage, changePage, quit]);

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
      setPage,
      standalone,
      readonly,
      page,
      maxPages: maxLocalPages,
      occurences,
      isFirstPage,
      isLastPage,
      validatedPages,
      questionnaire: source,
      bindings: allBindings,
      queenBindings,
    }),
    [
      menuOpen,
      quit,
      definitiveQuit,
      setPage,
      standalone,
      readonly,
      page,
      maxLocalPages,
      occurences,
      isFirstPage,
      isLastPage,
      validatedPages,
      source,
      allBindings,
      queenBindings,
    ]
  );

  const [expanded, setExpanded] = useState(false);

  const handleChangePanel = panel => (_, newExpanded) => {
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
                          return { ...acc, [key]: Array.isArray(value) ? value[ind] : value };
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
