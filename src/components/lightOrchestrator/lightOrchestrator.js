import * as lunatic from '@inseefr/lunatic';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import ButtonContinue from './buttons/continue/index';
import D from 'i18n';
import Header from './header';
import NavBar from './navBar';
import { PAGE_NAVIGATION_FORWARD } from 'utils/constants';
import { componentHasResponse } from 'utils/components/deduceState';
import { useCustomLunaticStyles } from 'components/orchestrator/lunaticStyle/style';
import { useLunaticFetcher } from 'utils/hook';
import { useStyles } from './lightOrchestrator.style';

function onLogChange(response, value, args) {
  console.log('onChange', { response, value, args });
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
  save,
  quit,
  definitiveQuit,
}) {
  const { data } = surveyUnit;
  const { lunaticFetcher: suggesterFetcher } = useLunaticFetcher();
  const classes = useStyles();
  const lunaticClasses = useCustomLunaticStyles();
  const [pageNavigationDirection, setPageNavigationDirection] = useState(PAGE_NAVIGATION_FORWARD);
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
    console.log('iam custom handle change bro!');
    if (lunaticStateRef === undefined) return;
    const { getComponents, goNextPage } = lunaticStateRef.current;
    const currentComponent = getComponents()[0];
    console.log(currentComponent);
    // search for Radio-like components
    if (
      (currentComponent.componentType === 'Radio',
      currentComponent.componentType === 'CheckboxBoolean')
    ) {
      console.log('Need only one response');
      goNextPage();
    } else {
      console.log('no auto-next page');
    }
  }, []);

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
  } = lunaticStateRef.current;

  const skipProofGoNextPage = useCallback(() => {
    setPageNavigationDirection('FORWARD');
    goNextPage();
  }, [goNextPage]);

  const skipProofGoPreviousPage = useCallback(() => {
    setPageNavigationDirection('BACKWARD');
    goPreviousPage();
  }, [goPreviousPage]);

  // TODO restore when lunatic handle object in missingButtons properties
  // const dontKnowButton = <MissingButton shortcutLabel="F2" buttonLabel={D.doesntKnowButton} />;
  // const refusedButton = <MissingButton shortcutLabel="F4" buttonLabel={D.refusalButton} />;
  const dontKnowButton = D.doesntKnowButton;
  const refusedButton = D.refusalButton;
  const logGetData = () => {
    console.log(getData(true));
  };

  const {
    maxPage = '1',
    page = '1',
    lastReachedPage = 1,
    subPage,
    nbSubPages,
    iteration,
    nbIterations,
  } = pager;
  const isLastReachedPage = page === lastReachedPage;

  // save data on page change
  useEffect(() => {
    if (lunaticStateRef.current === undefined) return;

    const { getData, pager } = lunaticStateRef.current;
    // save ask for a surveyUnit, new Data and current page, unused for Visualizer
    const { page } = pager;

    if (page === undefined) {
      console.log('no pager initialized, no data saved');
      return;
    }
    const updatedData = getData();
    console.log({ surveyUnit, updatedData, page });
    save(surveyUnit, updatedData, page);
    console.log('data saved');
  }, [page, lunaticStateRef, save, surveyUnit]);

  const memoQuit = useCallback(() => {
    quit(pager, getData);
  }, [getData, pager, quit]);

  const memoDefinitiveQuit = useCallback(() => {
    definitiveQuit(pager, getData);
  }, [getData, pager, definitiveQuit]);

  const components = getComponents();
  // const errors = getErrors();
  // const modalErrors = getModalErrors();
  const currentErrors = getCurrentErrors();

  const trueGoToPage = useCallback(
    page => {
      goToPage({ page: page });
    },
    [goToPage]
  );

  const goToLastReachedPage = useCallback(() => {
    trueGoToPage(lastReachedPage);
  }, [lastReachedPage, trueGoToPage]);

  const firstComponent = [...components]?.[0];
  const lunaticComponentId = firstComponent?.id ?? 'staticMissingId';
  const lunaticComponentType = firstComponent?.componentType ?? 'staticMissingType';
  const hasResponse = componentHasResponse(firstComponent);
  const hierarchy = firstComponent?.hierarchy ?? {
    sequence: { label: 'There is no sequence', page: '1' },
  };
  // directly from source, could be in raw VTL in future versions
  const {
    label: { value: questionnaireTitle },
  } = source;

  // skip sequences without declarations
  useEffect(() => {
    if (lunaticStateRef.current === undefined) return;
    const { goNextPage } = lunaticStateRef.current;
    if (
      lunaticComponentType === 'Sequence' &&
      pageNavigationDirection === PAGE_NAVIGATION_FORWARD
    ) {
      console.log('rhaaaaa, a sequence!! go nexxt nice fella');
      // no brain here : can't go back after reaching an empty sequence due to auto-skip
      goNextPage();
    } else {
      console.log('no sequence to skip or navigation= ', pageNavigationDirection);
    }
  }, [lunaticComponentId, lunaticComponentType, pageNavigationDirection]);

  const fakeRereading = false;
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
      <button onClick={() => logGetData()}>{`Get Lunatic Data ${pageNavigationDirection}`}</button>
      <div className={classes.bodyContainer}>
        <div className={classes.mainTile}>
          {components.map(function (component) {
            const { id, componentType, response, storeName, ...other } = component;
            const Component = lunatic[componentType];
            return (
              <div className={`${lunaticClasses.lunatic} ${componentType}`} key={`component-${id}`}>
                <Component
                  id={id}
                  response={response}
                  {...other}
                  {...component}
                  labelPosition="TOP"
                  unitPosition="AFTER"
                  preferences={preferences}
                  features={features}
                  writable
                  readOnly={readonly}
                  disabled={readonly}
                  focused // waiting for Lunatic feature
                  missing={missing}
                  missingStrategy={goNextPage}
                  savingType={savingType}
                  filterDescription={filterDescription}
                  missingShortcut={{ dontKnow: 'f2', refused: 'f4' }}
                  dontKnowButton={dontKnowButton}
                  refusedButton={refusedButton}
                  shortcut={true}
                  errors={currentErrors}
                />
              </div>
            );
          })}
          <ButtonContinue
            readonly={readonly}
            isLastPage={isLastPage}
            page={page}
            quit={quit}
            goNext={skipProofGoNextPage}
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
          goPrevious={skipProofGoPreviousPage}
          goNext={skipProofGoNextPage}
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
          setPageNavigationDirection={setPageNavigationDirection}
        />
      </div>
    </div>
  );
}

export default memo(LightOrchestrator);
