import { DOESNT_KNOW_KEY, REFUSAL_KEY, IGNORED_KEY } from 'utils/constants';
import { getResponsesNameFromComponent, getCollectedResponse } from './queen';

export const findPageIndex = components => page =>
  components ? components.findIndex(c => c.page === page) : -1;

export const getPreviousPage = components => currentPage => {
  if (!components || !currentPage) return 1;
  const index = findPageIndex(components)(currentPage);
  if (index <= 0) return 1;
  return components[index - 1].page || 1;
};

export const getNextPage = components => currentPage => {
  if (!components || !currentPage) return 1;
  const index = findPageIndex(components)(currentPage);
  if (index < 0 || index >= components.length - 1) return 1;
  return components[index + 1].page || 1;
};

const isInQueenData = queenData => response => {
  return (
    queenData[IGNORED_KEY].some(v => response.indexOf(v) !== -1) ||
    queenData[DOESNT_KNOW_KEY].some(v => response.indexOf(v) !== -1) ||
    queenData[REFUSAL_KEY].some(v => response.indexOf(v) !== -1)
  );
};

export const getFastForwardComponent = filterComponents => queenData => {
  const firstComponent = filterComponents.filter(component => {
    const { componentType } = component;
    const responsesName = getResponsesNameFromComponent(component);
    const collectedResponses = getCollectedResponse(component);
    const keyResponses = Object.keys(collectedResponses);
    return (
      !['Sequence', 'Subsequence'].includes(componentType) &&
      !isInQueenData(queenData)(responsesName) &&
      keyResponses.length === 0
    );
  })[0];
  return firstComponent;
};

export const getFastForwardPage = filterComponents => queenData => {
  const firstComponent = getFastForwardComponent(filterComponents)(queenData);
  const lastPage = filterComponents[filterComponents.length - 1].page;
  const page = firstComponent ? firstComponent.page : lastPage;
  return page;
};
