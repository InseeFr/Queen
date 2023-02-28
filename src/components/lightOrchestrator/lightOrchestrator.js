import * as lunatic from '@inseefr/lunatic';

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ButtonContinue from './buttons/continue/index';
import { ComponentDisplayer } from './componentDisplayer';
import D from 'i18n';
import Header from './header';
import { LoopPanel } from './LoopPanel';
import NavBar from './navBar';
import { componentHasResponse } from 'utils/components/deduceState';
import { useCustomLunaticStyles } from 'components/orchestrator/lunaticStyle/style';
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
  const lunaticClasses = useCustomLunaticStyles();
  console.log('LIGHT orchestrator renders');
  // TODO remove when provided by lunatic
  const mockedOverview = [
    {
      label: 'Seq-1',
      lunaticId: '#123',
      type: 'sequence',
      reached: true,
      visible: true,
      page: '1',
      children: [
        {
          label: 'Sous-Seq-1',
          lunaticId: '#124',
          type: 'subSequence',
          reached: false,
          visible: true,
          page: '2',
          children: [],
        },
      ],
    },
    {
      label: 'Seq-2',
      lunaticId: '#221',
      type: 'sequence',
      reached: false,
      visible: true,
      page: '3',
      children: [
        {
          label: 'Sous-Seq-2',
          lunaticId: '#222',
          type: 'subSequence',
          reached: false,
          visible: false,
          page: '4',
          children: [],
        },
      ],
    },
  ];
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

  lunaticStateRef.current = lunatic.useLunatic(source, data, {
    features,
    pagination,
    onChange: customHandleChange,
    preferences,
    autoSuggesterLoading,
    suggesters,
    suggesterFetcher,
  });

  const {
    getComponents,
    goPreviousPage,
    goNextPage,
    goToPage,
    isFirstPage,
    isLastPage,
    overview = mockedOverview,
    // waiting,
    pager,
    // getErrors,
    // getModalErrors,
    getCurrentErrors,
    getData,
    loopVariables = ['THL_PRENOM'],
  } = lunaticStateRef.current;

  // TODO restore when lunatic handle object in missingButtons properties
  // const dontKnowButton = <MissingButton shortcutLabel="F2" buttonLabel={D.doesntKnowButton} />;
  // const refusedButton = <MissingButton shortcutLabel="F4" buttonLabel={D.refusalButton} />;
  const dontKnowButton = 'dunno'; /*D.doesntKnowButton;*/
  const refusedButton = D.refusalButton;
  const logGetData = () => {
    console.log(getData(true));
  };

  const [currentPager, setCurrentPager] = useState();
  const [maxPage, setMaxPage] = useState();
  const [page, setPage] = useState();
  const [lastReachedPage, setLastReachedPage] = useState();
  const [subPage, setSubPage] = useState();
  const [nbSubPages, setNbSubPages] = useState();
  const [iteration, setIteration] = useState();
  const [nbIterations, setNbIterations] = useState();
  const [isLastReachedPage, setIsLastReachedPage] = useState(false);

  useEffect(() => {
    if (currentPager === undefined) return;
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
    console.log('trigger page/Save effect');
    const { getData, pager } = lunaticStateRef.current;
    // save ask for a surveyUnit, new Data and current page, unused for Visualizer
    const { page: pagerPage } = pager;

    // no page in state yet
    if (page === undefined) {
      setCurrentPager(pager);
      return;
    }

    // no page change => no save needed
    if (pagerPage === page) {
      return;
    } else {
      setCurrentPager(pager);
    }

    const updatedData = getData();
    console.log('save', { surveyUnit, updatedData, page });
    save(surveyUnit, updatedData, page);
  }, [page, lunaticStateRef, save, surveyUnit, pager]);

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
    page => {
      goToPage({ page: page });
    },
    [goToPage]
  );

  const goToLastReachedPage = useCallback(() => {
    trueGoToPage(lastReachedPage);
  }, [lastReachedPage, trueGoToPage]);

  const firstComponent = useMemo(() => [...components]?.[0], [components]);
  console.log({ firstComponent });
  const hasResponse = componentHasResponse(firstComponent);

  const [hierarchy, setHierarchy] = useState({
    sequence: { label: 'There is no sequence', page: '1' },
  });

  useEffect(() => {
    if (firstComponent !== undefined) setHierarchy(firstComponent.hierarchy);
  }, [firstComponent]);
  // directly from source, could be in raw VTL in future versions
  const {
    label: { value: questionnaireTitle },
  } = source;

  const fakeRereading = false;
  const missingShortcut = useMemo(() => ({ dontKnow: 'f2', refused: 'f4' }), []);

  const missingStrategy = useCallback(() => {
    console.log('missing strategy : go next page');
    goNextPage();
  }, [goNextPage]);

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
      <button onClick={() => goToPage({ page: '29' })}>{`Go loop `}</button>
      <div className={classes.bodyContainer}>
        <div className={classes.mainTile}>
          <div className={classes.activeView}>
            <ComponentDisplayer
              components={components}
              preferences={preferences}
              features={features}
              readonly={readonly}
              missing={missing}
              missingStrategy={missingStrategy}
              savingType={savingType}
              filterDescription={filterDescription}
              missingShortcut={missingShortcut}
              dontKnowButton={dontKnowButton}
              refusedButton={refusedButton}
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
