import { getResponsesNameFromComponent, getCollectedResponse } from './queen';
import { isInSpecialQueenData } from './specialQueenData';

export const findPageIndex = components => page =>
  components ? components.findIndex(c => c.page === page) : -1;

export const getPreviousPage = components => currentPage => {
  if (!components || !currentPage) return 1;
  const index = findPageIndex(components)(currentPage);
  if (index <= 0) return 1;
  return components[index - 1].page || components[index + 1].goToPage - 1 || 1;
};

export const getNextPage = components => currentPage => {
  if (!components || !currentPage) return 1;
  const index = findPageIndex(components)(currentPage);
  if (index < 0 || index >= components.length - 1) return 1;
  return components[index + 1].page || components[index + 1].goToPage || 1;
};

export const getFastForwardComponent = filterComponents => specialQueenData => {
  const firstComponent = filterComponents.filter(component => {
    const { componentType } = component;
    const responsesName = getResponsesNameFromComponent(component);
    const collectedResponses = getCollectedResponse(component);
    const keyResponses = Object.keys(collectedResponses);
    return (
      !['Sequence', 'Subsequence'].includes(componentType) &&
      !isInSpecialQueenData(specialQueenData)(responsesName) &&
      keyResponses.length === 0
    );
  })[0];
  return firstComponent;
};

export const getFastForwardPage = filterComponents => specialQueenData => {
  const firstComponent = getFastForwardComponent(filterComponents)(specialQueenData);
  const lastPage = filterComponents[filterComponents.length - 1].page;
  const page = firstComponent ? firstComponent.page : lastPage;
  return page;
};
