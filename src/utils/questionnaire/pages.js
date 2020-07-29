import { getResponsesNameFromComponent, getCollectedResponse } from './queen';
import * as lunatic from '@inseefr/lunatic';
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

export const getFastForwardComponent = questionnaire => filteredComponents => specialQueenData => {
  const firstComponent = filteredComponents.filter(component => {
    const { componentType, page } = component;
    const responsesName = getResponsesNameFromComponent(component);
    const collectedResponses = getCollectedResponse(questionnaire)(component);
    const keyResponses = Object.keys(collectedResponses);
    return (
      page &&
      !['Sequence', 'Subsequence', 'FilterDescription'].includes(componentType) &&
      !isInSpecialQueenData(specialQueenData)(responsesName) &&
      keyResponses.length === 0
    );
  })[0];
  return firstComponent;
};

export const getFastForwardPage = questionnaire => bindings => specialQueenData => {
  const filterComponents = questionnaire.components.filter(
    ({ conditionFilter }) => lunatic.interpret(['VTL'])(bindings)(conditionFilter) === 'normal'
  );
  const firstComponent = getFastForwardComponent(questionnaire)(filterComponents)(specialQueenData);
  const lastPage = filterComponents[filterComponents.length - 1].page;
  const page = firstComponent ? firstComponent.page : lastPage;
  return page;
};

export const getFirstTitlePageBeforeFastForwardPage = questionnaire => bindings => specialQueenData => {
  const filterComponents = questionnaire.components.filter(
    ({ conditionFilter }) => lunatic.interpret(['VTL'])(bindings)(conditionFilter) === 'normal'
  );
  const fastPage = getFastForwardPage(questionnaire)(bindings)(specialQueenData);
  const componentsBefore = filterComponents.filter(component => {
    const { page, componentType } = component;
    return (
      page &&
      page < fastPage &&
      !['Sequence', 'Subsequence', 'FilterDescription'].includes(componentType)
    );
  });
  return componentsBefore.length > 0 ? fastPage : 1;
};
