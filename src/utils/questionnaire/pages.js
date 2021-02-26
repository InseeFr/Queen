import * as lunatic from '@inseefr/lunatic';
import { getCollectedResponse } from './queen';

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
  if (index < 0 || index >= components.length - 1) return components[components.length - 1].page;
  return components[index + 1].page || components[index + 1].goToPage || 1;
};

/**
 * Return the first component without response
 * ( alternative : the last component with response, return the following component)
 * @param {*} questionnaire
 */
export const getFastForwardComponent = questionnaire => filteredComponents => {
  return filteredComponents.filter(component => {
    const { componentType, page } = component;
    const collectedResponses = getCollectedResponse(questionnaire)(component);
    const keyResponses = Object.keys(collectedResponses);
    return (
      page &&
      !['Sequence', 'Subsequence', 'FilterDescription'].includes(componentType) &&
      keyResponses.length === 0
    );
  })[0];
};

export const getFastForwardPage = questionnaire => bindings => {
  const filterComponents = questionnaire.components.filter(
    ({ conditionFilter }) => lunatic.interpret(['VTL'])(bindings)(conditionFilter) === 'normal'
  );
  const firstComponent = getFastForwardComponent(questionnaire)(filterComponents);
  const lastPage = filterComponents[filterComponents.length - 1].page;
  return firstComponent ? firstComponent.page : lastPage;
};

export const getFirstTitlePageBeforeFastForwardPage = questionnaire => bindings => {
  const filterComponents = questionnaire.components.filter(
    ({ conditionFilter }) => lunatic.interpret(['VTL'])(bindings)(conditionFilter) === 'normal'
  );
  const fastPage = getFastForwardPage(questionnaire)(bindings);
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
