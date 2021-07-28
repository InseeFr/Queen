import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import * as UQ from 'utils/questionnaire';
import { DIRECT_CONTINUE_COMPONENTS } from 'utils/constants';
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
import D from 'i18n';

export const OrchestratorContext = React.createContext();

const Orchestrator = ({
  surveyUnit,
  standalone,
  readonly,
  savingType,
  preferences,
  pagination,
  missing,
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
  const [haveToGoNext, setHaveToGoNext] = useState(false);

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

  const {
    maxLocalPages,
    occurences,
    currentComponent,
    occurencesIndex,
  } = UQ.getInfoFromCurrentPage(components)(bindings)(page)(maxPage);
  const { componentType: currentComponentType, hierarchy } = currentComponent || {};

  const previousFilled = UQ.isPreviousFilled(questionnaire)(currentComponent)(occurencesIndex);

  /**
   * This function updates the values of the questionnaire responses
   * from the data entered by the user.
   * This function is disabled when app is in readonly mode.
   * @param {*} component the current component
   */
  const onChange = async updatedValue => {
    if (!readonly) {
      setQuestionnaireUpdated(false);
      handleChange(updatedValue);
      setQuestionnaireUpdated(true);
      setHaveToGoNext(UQ.haveToGoNext(currentComponentType, updatedValue));
    }
  };

  useEffect(() => {
    if (!isLastPage && haveToGoNext) {
      setChangingPage(true);
      setTimeout(() => {
        changePage('next');
      }, 100);
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

  const context = {
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
  };

  const missingStrategy = b => {
    if (!isLastPage) {
      setChangingPage(true);
      setTimeout(() => {
        changePage('next', b);
      }, 200);
    }
  };
  return (
    <OrchestratorContext.Provider value={context}>
      <div className={classes.root}>
        <Header title={questionnaire.label} quit={quit} hierarchy={hierarchy} setPage={setPage} />
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
                      dontKnowButton={
                        <>
                          <span className="shortcut">F2</span>
                          {D.doesntKnowButton}
                          <span className="checked" />
                        </>
                      }
                      refusedButton={
                        <>
                          <span className="shortcut">F4</span>
                          {D.refusalButton}
                          <span className="checked" />
                        </>
                      }
                      missingShortcut={{ dontKnow: 'f2', refused: 'f4' }}
                      shortcut={true}
                    />
                  </div>
                );
              return null;
            })}
            {(!DIRECT_CONTINUE_COMPONENTS.includes(currentComponentType) || readonly) &&
              (!validatedPages.includes(page) || isLastPage) &&
              !previousFilled && <ContinueButton setPendingChangePage={setPendingChangePage} />}
          </div>

          <NavBar>
            <Buttons
              rereading={validatedPages.includes(page) || previousFilled}
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
