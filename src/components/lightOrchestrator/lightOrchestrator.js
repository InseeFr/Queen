import * as lunatic from '@inseefr/lunatic';

import React, { memo } from 'react';

import Header from './header';
import { useLunaticFetcher } from 'utils/hook';

function Pager({ goPrevious, goNext, goToPage, isLast, isFirst, pageTag, maxPage, getData }) {
  if (maxPage && maxPage > 1) {
    const Button = lunatic.Button;
    return (
      <>
        <div className="pagination">
          <Button onClick={goPrevious} disabled={isFirst}>
            Previous
          </Button>
          <Button onClick={goNext} disabled={isLast}>
            Next
          </Button>
          <Button onClick={() => console.log(getData(true))}>Get State</Button>
          {/* pas moyen d'évaluer maxPage sans avoir une virgule au rendu... */}
          <Button onClick={() => goToPage({ page: maxPage })}>Go to page {maxPage}</Button>
        </div>
        <div>PAGE: {pageTag}</div>
      </>
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
  const { maxPage } = source;
  const { data } = surveyUnit;
  const { lunaticFetcher: suggesterFetcher } = useLunaticFetcher();

  const {
    getComponents,
    goPreviousPage,
    goNextPage,
    goToPage,
    pageTag,
    isFirstPage,
    isLastPage,
    waiting,
    getErrors,
    getModalErrors,
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

  const components = getComponents();
  const errors = getErrors();
  const modalErrors = getModalErrors();
  const currentErrors = getCurrentErrors();

  const fakeHierarchy = { sequence: { value: 'fake' } };

  return (
    <div className="container">
      <Header
        title="My nice title"
        hierarchy={fakeHierarchy}
        setPage={() => console.log('page set')}
        page
        questionnaire={source}
        standalone
        queenBindings
        quit
        currentPage
      />
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
      <Pager
        goPrevious={goPreviousPage}
        goNext={goNextPage}
        goToPage={goToPage}
        isLast={isLastPage}
        isFirst={isFirstPage}
        pageTag={pageTag}
        maxPage={maxPage}
        getData={getData}
      />
    </div>
  );
}

export default memo(LightOrchestrator);
