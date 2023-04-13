import * as lunatic from '@inseefr/lunatic';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import D from 'i18n';
import { componentHasResponse } from 'utils/components/deduceState';
import { LoopPanel } from './LoopPanel';
import ButtonContinue from './buttons/continue/index';
import { ComponentDisplayer } from './componentDisplayer';
import Header from './header';
import { useStyles } from './lightOrchestrator.style';
import NavBar from './navBar';

function onLogChange(response, value, args) {
  console.log('onChange', { response, value, args });
}

function noDataChange() {
  /**/
}

const preferences = ['COLLECTED'];
const features = ['VTL'];
const savingType = 'COLLECTED';

const missingShortcut = { dontKnow: 'f2', refused: 'f4' };

function LightOrchestrator({
  surveyUnit,
  standalone,
  readonly,
  pagination,
  source,
  getReferentiel,
  missing = true,
  shortcut = true,
  autoSuggesterLoading,
  filterDescription,
  onChange = onLogChange,
  onDataChange = noDataChange,
  save,
  quit,
  definitiveQuit,
}) {
  const { data } = surveyUnit;
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

  // TODO restore when lunatic handle object in missingButtons properties
  // const dontKnowButton = <MissingButton shortcutLabel="F2" buttonLabel={D.doesntKnowButton} />;
  // const refusedButton = <MissingButton shortcutLabel="F4" buttonLabel={D.refusalButton} />;
  const dontKnowButton = `F2 ${D.doesntKnowButton}`;
  const refusedButton = `F4 ${D.refusalButton}`;

  lunaticStateRef.current = lunatic.useLunatic(source, data, {
    features,
    pagination,
    onChange: customHandleChange,
    preferences,
    autoSuggesterLoading,
    getReferentiel,
    missing,
    shortcut,
    missingStrategy,
    withOverview: true,
    missingShortcut,
    dontKnowButton,
    refusedButton,
    withAutofocus: true,
  });

  // useDetectChange({
  //   source,
  //   data,
  //   features,
  //   pagination,
  //   customHandleChange,
  //   preferences,
  //   autoSuggesterLoading,
  //   suggesters,
  //   suggesterFetcher,
  //   missing,
  //   missingStrategy,
  //   missingShortcut,
  //   dontKnowButton,
  //   refusedButton,
  // });

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
    Provider,
  } = lunaticStateRef.current;

  const previousPager = useRef();

  // page change : update pager and save data
  useEffect(() => {
    if (lunaticStateRef.current === undefined) return;
    const { getData, pager } = lunaticStateRef.current;
    // save ask for an optional new questionnaire state, new Data and current page, unused for Visualizer
    // no previous pager for comparison : save current pager for future comparisons
    if (previousPager.current === undefined) {
      previousPager.current = pager;
      return;
    }
    // no page change => no save needed
    if (previousPager.current.page === pager.page) {
      return;
    }
    // page change : update current pager then save
    previousPager.current = pager;
    save(undefined, getData(), pager.page);
  }, [save, pager]);

  const memoQuit = useCallback(() => {
    quit(previousPager.current, getData);
  }, [getData, quit]);

  const memoDefinitiveQuit = useCallback(() => {
    definitiveQuit(previousPager.current, getData);
  }, [getData, definitiveQuit]);

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
    if (previousPager.current === undefined) return;
    trueGoToPage(previousPager.current.lastReachedPage);
  }, [trueGoToPage]);

  const firstComponent = useMemo(() => [...components]?.[0], [components]);
  const hasResponse = componentHasResponse(firstComponent);

  const hierarchy = firstComponent?.hierarchy ?? {
    sequence: { label: 'There is no sequence', page: '1' },
  };

  // directly from source, could be in raw VTL in future versions
  const {
    label: { value: questionnaireTitle },
  } = source;

  if (previousPager === undefined) return null;
  const isLastReachedPage = pager ? pager.page === pager.lastReachedPage : false;
  const { maxPage, page, subPage, nbSubPages, iteration, nbIterations } = pager;

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
            <Provider>
              <ComponentDisplayer
                components={components}
                preferences={preferences}
                features={features}
                readonly={readonly}
                savingType={savingType}
                filterDescription={filterDescription}
                currentErrors={currentErrors}
              />
            </Provider>
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
            rereading={!isLastReachedPage}
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
          rereading={!isLastReachedPage}
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
