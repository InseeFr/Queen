import * as lunatic from '@inseefr/lunatic';

import React, { memo, useCallback } from 'react';

import ButtonContinue from './buttons/continue/index';
import D from 'i18n';
import Header from './header';
import { MissingButton } from './buttons/missing/missing-button';
import NavBar from './navBar';
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
  save,
  close,
}) {
  const { data } = surveyUnit;
  const { lunaticFetcher: suggesterFetcher } = useLunaticFetcher();
  const classes = useStyles();
  const lunaticClasses = useCustomLunaticStyles();

  // TODO remove when provided by lunatic
  const mockedBreacrumb = [
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

  const {
    getComponents,
    goPreviousPage,
    goNextPage,
    goToPage,
    isFirstPage,
    isLastPage,
    breadcrumb = mockedBreacrumb,
    // waiting,
    pager,
    // getErrors,
    // getModalErrors,
    getCurrentErrors,
    getData,
  } = lunatic.useLunatic(source, data, {
    features,
    pagination,
    preferences,
    onChange: onLogChange,
    autoSuggesterLoading,
    suggesters,
    suggesterFetcher,
  });

  const dontKnowButton = <MissingButton shortcutLabel="F2" buttonLabel={D.doesntKnowButton} />;
  const refusedButton = <MissingButton shortcutLabel="F4" buttonLabel={D.refusalButton} />;
  const logGetData = () => {
    console.log(getData(true));
  };

  const {
    maxPage = '100',
    page = '1',
    lastReachedPage = 1,
    subPage,
    nbSubPages,
    iteration,
    nbIterations,
  } = pager;
  const isLastReachedPage = page === lastReachedPage;

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
  const hasResponse = componentHasResponse(firstComponent);
  const hierarchy = firstComponent?.hierarchy ?? {
    sequence: { label: 'There is no sequence', page: '1' },
  };
  // directly from source, could be in raw VTL in future versions
  const {
    label: { value: questionnaireTitle },
  } = source;

  const fakeRereading = false;
  return (
    <div className={classes.root}>
      <Header
        title={questionnaireTitle}
        hierarchy={hierarchy}
        setPage={trueGoToPage}
        page={page}
        breadcrumb={breadcrumb}
        standalone={standalone}
        quit
        currentPage
      />
      <button onClick={() => logGetData()}>LOG</button>
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
