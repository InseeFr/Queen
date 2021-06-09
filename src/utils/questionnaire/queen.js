import * as lunatic from '@inseefr/lunatic';

/**
 * This function returns the list of variables collected by a component
 * (regardless of their state).
 * @param {*} component (single Component)
 */
export const getResponsesNameFromComponent = component => {
  const { componentType } = component;
  if (componentType && !['CheckboxGroup', 'Table'].includes(componentType)) {
    const { response } = component;
    return response ? [response.name] : [];
  }
  if (componentType && componentType === 'CheckboxGroup') {
    const { responses } = component;
    return responses.reduce((_, response) => {
      return [..._, response.response.name];
    }, []);
  }
  if (componentType && componentType === 'Table') {
    const { cells } = component;
    return cells.reduce((_, line) => {
      return [
        ..._,
        ...line.reduce((_line, cell) => {
          return [..._line, ...getResponsesNameFromComponent(cell)];
        }, []),
      ];
    }, []);
  }
  return [];
};

export const getComponentResponse = questionnaire => component => (type = 'COLLECTED') => {
  const { variables } = questionnaire;
  const { COLLECTED, ...other } = variables;
  const newCOLLECTED = Object.entries(COLLECTED).reduce((init, [name, values]) => {
    const newVar = init;
    const { componentRef } = values;
    if (componentRef === component?.id) {
      newVar[name] = values;
    }
    return newVar;
  }, {});
  const newVariables = { COLLECTED: newCOLLECTED, ...other };
  return lunatic.getCollectedStateByValueType({ variables: newVariables })(type);
};

export const isPreviousFilled = questionnaire => component =>
  Object.entries(getComponentResponse(questionnaire)(component)('PREVIOUS')).length > 0;

/**
 * This function returns the list of variables that must be reset to "null"
 * because they depend on a filter that has been updated.
 * @param {Array} components (list of component)
 * @param {String} response (the response name)
 * @returns list of collectedVariables
 */
export const getResponsesLinkWith = components => response => {
  const regexpTest = new RegExp(`\\b${response}\\b`);
  return components.reduce((_, component) => {
    const { conditionFilter } = component;
    if (conditionFilter) {
      const responses = regexpTest.test(conditionFilter?.value)
        ? getResponsesNameFromComponent(component)
        : [];
      return [..._, ...responses];
    }
    return _;
  }, []);
};

/**
 * This function sets to "null" the collected variables that depend on a filter
 * that depends on the variables collected by the current component.
 * @param {*} questionnaire
 * @param {*} currentComponent
 * @returns newQuestionnaire
 */
export const updateResponseFiltered = questionnaire => currentComponent => {
  let newQuestionnaire = { ...questionnaire };
  const collectedResponses = getResponsesNameFromComponent(currentComponent);
  collectedResponses.forEach(response => {
    const linkedResponses = getResponsesLinkWith(newQuestionnaire.components)(response);
    linkedResponses.forEach(linkedResponse => {
      const updatedValue = {};
      updatedValue[linkedResponse] = null;
      newQuestionnaire = lunatic.updateQuestionnaire('COLLECTED')(newQuestionnaire)(['COLLECTED'])(
        updatedValue
      );
    });
  });
  return newQuestionnaire;
};

export const getKeyToHandle = (responses, options) => {
  if (options) {
    return options.length < 10 ? ['numeric'] : ['alphabetic'];
  }
  if (responses) {
    return responses.length < 10 ? ['numeric'] : ['alphabetic'];
  }
  return [];
};
