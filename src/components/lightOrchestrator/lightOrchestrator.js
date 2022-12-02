import * as lunatic from '@inseefr/lunatic';

import React, { memo, useCallback } from 'react';

import Header from './header';
import NavBar from './navBar';
import { useLunaticFetcher } from 'utils/hook';
import { useStyles } from './lightOrchestrator.style';

function Pager({ goToPage, pageTag, maxPage, getData }) {
  const logGetData = useCallback(() => console.log(getData(true)), [getData]);

  if (maxPage && maxPage > 1) {
    const Button = lunatic.Button;
    return (
      <div className="pagination">
        <Button onClick={logGetData}>Get State</Button>
        <Button onClick={() => goToPage(maxPage)}>{`Go to max page : ${maxPage}`}</Button>
        <div>PAGE: {pageTag}</div>
      </div>
    );
  }
  return null;
}

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
  const {
    getComponents,
    goPreviousPage,
    goNextPage,
    goToPage,
    pageTag,
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

  const { maxPage = '100', page = '1' } = pager;
  const components = getComponents();
  // const errors = getErrors();
  // const modalErrors = getModalErrors();
  const currentErrors = getCurrentErrors();

  const trueGoToPage = page => {
    goToPage({ page: page });
  };

  const hierarchy = [...components]?.[0]?.hierarchy ?? {
    sequence: { label: 'There is no sequence', page: '1' },
  };
  const {
    label: { value: questionnaireTitle },
  } = source;
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
      <div className={classes.bodyContainer}>
        <div className="components">
          {components.map(function (component) {
            const { id, componentType, response, storeName, ...other } = component;
            const Component = lunatic[componentType];
            return (
              <div className="lunatic lunatic-component" key={`component-${id}`}>
                <Component
                  id={id}
                  response={response}
                  {...other}
                  {...component}
                  missing={missing}
                  missingStrategy={goNextPage}
                  filterDescription={filterDescription}
                  errors={currentErrors}
                />
              </div>
            );
          })}
        </div>
        <NavBar
          page={page}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          goPrevious={goPreviousPage}
          goNext={goNextPage}
          maxPages={maxPage}
          rereading={false}
          // force display navigation buttons TODO use readonly prop
          readonly={true}
          setPendingChangePage={page => console.log('setPendingPage to ', page)}
        />
      </div>
      <Pager goToPage={trueGoToPage} pageTag={pageTag} maxPage={maxPage} getData={getData} />
    </div>
  );
}

export default memo(LightOrchestrator);
