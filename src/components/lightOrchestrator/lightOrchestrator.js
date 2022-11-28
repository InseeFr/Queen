import * as lunatic from '@inseefr/lunatic';

import React, { memo, useCallback } from 'react';

import Header from './header';
import NavBar from './navBar';
import SimpleLoader from 'components/shared/preloader/simple';
import { useLunaticFetcher } from 'utils/hook';

function Pager({ goPrevious, goNext, goToPage, isLast, isFirst, pageTag, maxPage, getData }) {
  const onClick = useCallback(() => goToPage(maxPage), [goToPage, maxPage]);
  const logGetData = useCallback(() => console.log(getData(true)), [getData]);
  const ucbGoPrevious = useCallback(whatever => goPrevious(whatever), [goPrevious]);
  const ucbGoNext = useCallback(whatever => goNext(whatever), [goNext]);

  if (maxPage && maxPage > 1) {
    const Button = lunatic.Button;

    return (
      <>
        <div className="pagination">
          <Button onClick={ucbGoPrevious} disabled={isFirst}>
            Previous
          </Button>
          <Button onClick={ucbGoNext} disabled={isLast}>
            Next
          </Button>
          <Button onClick={logGetData}>Get State</Button>
          {/* pas moyen d'évaluer maxPage sans avoir une virgule au rendu... */}
          <Button onClick={onClick}>{`Go to page ${maxPage}`}</Button>
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
    pager,
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

  const { maxPage = '100', page = '1' } = pager;
  const components = getComponents();
  const errors = getErrors();
  const modalErrors = getModalErrors();
  const currentErrors = getCurrentErrors();

  const ucbGoToPage = useCallback(
    page => {
      goToPage({ page: page });
    },
    [goToPage]
  );

  const fakeHierarchy = {
    sequence: { label: 'Fake Séquence go to p8', page: '8' },
    subSequence: { label: 'Fake Sous-séquence go to p50', page: '50' },
  };
  const fakeBindings = {};
  return (
    <div className="container">
      <Header
        title="My nice title"
        hierarchy={fakeHierarchy}
        setPage={ucbGoToPage}
        page={page}
        questionnaire={source}
        standalone
        queenBindings={fakeBindings}
        quit
        currentPage
      />
      {waiting && <SimpleLoader />}
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
        // goToPage={goToPage}
        goToPage={ucbGoToPage}
        isLast={isLastPage}
        isFirst={isFirstPage}
        pageTag={pageTag}
        maxPage={maxPage}
        getData={getData}
      />
      <NavBar page={page} maxPages={maxPage} rereading setPendingChangePage />
    </div>
  );
}

export default memo(LightOrchestrator);
