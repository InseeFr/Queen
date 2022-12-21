import * as lunatic from '@inseefr/lunatic';

import React, { memo } from 'react';

import ButtonContinue from './buttons/continue/index';
import Header from './header';
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

  const {
    getComponents,
    goPreviousPage,
    goNextPage,
    goToPage,
    // pageTag,
    isFirstPage,
    isLastPage,
    // waiting,
    pager,
    // getErrors,
    // getModalErrors,
    getCurrentErrors,
    getData,
  } = lunatic.useLunatic(source, data, {
    features,
    preferences,
    onChange: onLogChange,
    autoSuggesterLoading,
    suggesters,
    suggesterFetcher,
  });

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

  const trueGoToPage = page => {
    goToPage({ page: page });
  };

  const goToLastReachedPage = () => trueGoToPage(lastReachedPage);

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
        questionnaire={source}
        standalone={false}
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
                  missing={missing}
                  focused // waiting for Lunatic feature
                  missingStrategy={goNextPage}
                  filterDescription={filterDescription}
                  missingShortcut={{ dontKnow: 'f2', refused: 'f4' }}
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
          // force display navigation buttons TODO use readonly prop
          readonly={readonly}
        />
      </div>
    </div>
  );
}

export default memo(LightOrchestrator);
