import * as lunatic from '@inseefr/lunatic';

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ButtonContinue from './buttons/continue/index';
import { ComponentDisplayer } from './componentDisplayer';
import D from 'i18n';
import Header from './header';
import { LoopPanel } from './LoopPanel';
import NavBar from './navBar';
import { componentHasResponse } from 'utils/components/deduceState';
import { useLunaticFetcher } from 'utils/hook';
import { useStyles } from './lightOrchestrator.style';

function onLogChange(response, value, args) {
  console.log('onChange', { response, value, args });
}

function noDataChange() {
  /**/
}

function LightOrchestrator({
  surveyUnit,
  standalone,
  readonly,
  savingType,
  preferences,
  pagination,
  missing,
  features,
  source,
  suggesters,
  autoSuggesterLoading,
  filterDescription,
  onChange = onLogChange,
  onDataChange = noDataChange,
  save,
  quit,
  definitiveQuit,
}) {
  const { data } = surveyUnit;
  const { lunaticFetcher: suggesterFetcher } = useLunaticFetcher();
  const classes = useStyles();
  const lunaticStateRef = useRef();

  // allow auto-next page when component is "complete"
  const customHandleChange = useCallback(() => {
    if (lunaticStateRef === undefined) return;
    const { getComponents, goNextPage, getData } = lunaticStateRef.current;

    // check if state should be updated, and events sent
    const { COLLECTED } = getData();
    onDataChange(COLLECTED);

    const currentComponent = getComponents()[0];
    // search for Radio-like components
    if (
      currentComponent.componentType === 'Radio' ||
      currentComponent.componentType === 'CheckboxBoolean' ||
      currentComponent.componentType === 'CheckboxOne'
    ) {
      goNextPage();
    }
  }, [onDataChange]);

  const missingStrategy = useCallback(() => {
    if (lunaticStateRef === undefined) return;
    const { goNextPage } = lunaticStateRef.current;
    goNextPage();
  }, []);

  const missingShortcut = useMemo(() => ({ dontKnow: 'f2', refused: 'f4' }), []);

  // TODO restore when lunatic handle object in missingButtons properties
  // const dontKnowButton = <MissingButton shortcutLabel="F2" buttonLabel={D.doesntKnowButton} />;
  // const refusedButton = <MissingButton shortcutLabel="F4" buttonLabel={D.refusalButton} />;
  const dontKnowButton = D.doesntKnowButton;
  const refusedButton = D.refusalButton;

  lunaticStateRef.current = lunatic.useLunatic(source, data, {
    features,
    pagination,
    onChange: customHandleChange,
    preferences,
    autoSuggesterLoading,
    suggesters,
    suggesterFetcher,
    missing: { missing },
    shortcut: true,
    missingStrategy: { missingStrategy },
    withOverview: true,
    missingShortcut: { missingShortcut },
    dontKnowButton: { dontKnowButton },
    refusedButton: { refusedButton },
    withAutofocus: true,
  });

  const {
    getComponents,
    goPreviousPage,
    goNextPage,
    goToPage,
    isFirstPage,
    isLastPage,
    overview = [],
    // waiting,
    pager,
    // getErrors,
    // getModalErrors,
    getCurrentErrors,
    getData,
    loopVariables = [],
  } = lunaticStateRef.current;

  const [currentPager, setCurrentPager] = useState();
  const [maxPage, setMaxPage] = useState();
  const [page, setPage] = useState();
  const [lastReachedPage, setLastReachedPage] = useState();
  const [subPage, setSubPage] = useState();
  const [nbSubPages, setNbSubPages] = useState();
  const [iteration, setIteration] = useState();
  const [nbIterations, setNbIterations] = useState();
  const [isLastReachedPage, setIsLastReachedPage] = useState(false);
  console.log('lightorchestrator rerender ', overview);
  useEffect(() => {
    if (currentPager === undefined) return;
    console.log('currentPager changed');
    const {
      maxPage: currentMaxPage = '1',
      page: currentPage = '1',
      lastReachedPage: currentLastReachedPage = 1,
      subPage: currentSubPage,
      nbSubPages: currentNbSubPages,
      iteration: currentIteration,
      nbIterations: currentNbIterations,
    } = currentPager;
    setIsLastReachedPage(currentPage === currentLastReachedPage);
    setMaxPage(currentMaxPage);
    setPage(currentPage);
    setLastReachedPage(currentLastReachedPage);
    setSubPage(currentSubPage);
    setNbSubPages(currentNbSubPages);
    setIteration(currentIteration);
    setNbIterations(currentNbIterations);
  }, [currentPager]);

  // page change : update pager and save data
  useEffect(() => {
    if (lunaticStateRef.current === undefined) return;
    const { getData, pager } = lunaticStateRef.current;
    // save ask for an optional new questionnaire state, new Data and current page, unused for Visualizer
    const { page: pagerPage } = pager;

    // no page in state yet
    if (page === undefined) {
      setCurrentPager(pager);
      return;
    }

    // no page change => no save needed
    if (pagerPage === page) {
      return;
    }
    setCurrentPager(pager);

    const updatedData = getData();
    // no questionnaire stata change here
    save(undefined, updatedData, page);
  }, [page, lunaticStateRef, save, pager]);

  const memoQuit = useCallback(() => {
    quit(currentPager, getData);
  }, [getData, currentPager, quit]);

  const memoDefinitiveQuit = useCallback(() => {
    definitiveQuit(currentPager, getData);
  }, [getData, currentPager, definitiveQuit]);

  const [components, setComponents] = useState([]);

  // persist components independently from Lunatic state
  useEffect(() => {
    if (typeof getComponents === 'function') {
      setComponents(getComponents);
    }
  }, [getComponents]);

  // const errors = getErrors();
  // const modalErrors = getModalErrors();
  const currentErrors = typeof getCurrentErrors === 'function' ? getCurrentErrors() : [];

  const trueGoToPage = useCallback(
    targetPage => {
      console.log('go to page', targetPage);
      if (typeof targetPage === 'string') {
        goToPage({ page: targetPage });
      } else {
        const { page, iteration, subPage } = targetPage;
        goToPage({ page: page, iteration: iteration, subPage: subPage });
      }
    },
    [goToPage]
  );

  const goToLastReachedPage = useCallback(() => {
    trueGoToPage(lastReachedPage);
  }, [lastReachedPage, trueGoToPage]);

  const firstComponent = useMemo(() => [...components]?.[0], [components]);
  const hasResponse = componentHasResponse(firstComponent);

  const hierarchy = firstComponent?.hierarchy ?? {
    sequence: { label: 'There is no sequence', page: '1' },
  };

  // directly from source, could be in raw VTL in future versions
  const {
    label: { value: questionnaireTitle },
  } = source;

  const fakeRereading = false;

  if (currentPager === undefined) return null;
  return (
    <div className={classes.root}>
      <Header
        title={questionnaireTitle}
        hierarchy={hierarchy}
        setPage={trueGoToPage}
        overview={overview}
        standalone={standalone}
        readonly={readonly}
        quit={memoQuit}
        definitiveQuit={memoDefinitiveQuit}
        currentPage={page}
      />
      <div className={classes.bodyContainer}>
        <div className={classes.mainTile}>
          <div className={classes.activeView}>
            <ComponentDisplayer
              components={components}
              preferences={preferences}
              features={features}
              readonly={readonly}
              savingType={savingType}
              filterDescription={filterDescription}
              currentErrors={currentErrors}
            ></ComponentDisplayer>
            <LoopPanel
              loopVariables={loopVariables}
              getData={getData}
              pager={pager}
              goToPage={trueGoToPage}
            ></LoopPanel>
          </div>
          <ButtonContinue
            readonly={readonly}
            isLastPage={isLastPage}
            page={page}
            quit={quit}
            goNext={goNextPage}
            rereading={fakeRereading}
            isLastReachedPage={isLastReachedPage}
            componentHasResponse={hasResponse}
            goToLastReachedPage={goToLastReachedPage}
          ></ButtonContinue>
        </div>
        <NavBar
          page={page}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          goPrevious={goPreviousPage}
          goNext={goNextPage}
          maxPages={maxPage}
          subPage={subPage + 1}
          nbSubPages={nbSubPages}
          iteration={iteration}
          nbIterations={nbIterations}
          rereading={fakeRereading}
          componentHasResponse={hasResponse}
          isLastReachedPage={isLastReachedPage}
          goLastReachedPage={goToLastReachedPage}
          readonly={readonly}
        />
      </div>
    </div>
  );
}

export default memo(LightOrchestrator);
