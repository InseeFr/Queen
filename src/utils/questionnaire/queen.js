import * as lunatic from '@inseefr/lunatic';

export const secureCopy = objectToCopy => JSON.parse(JSON.stringify(objectToCopy));

// iterations is [1, 2, 4] = first element in Loop, then in this Loop, second element, then the fourth
export const changeDeepValue = vecteur => iterations => newValue => {
  const [firstVal, ...otherVals] = iterations;
  if (iterations.length > 1) {
    changeDeepValue(vecteur[firstVal])(otherVals)(newValue);
  } else {
    if (Array.isArray(vecteur)) vecteur[firstVal] = newValue;
    else vecteur = newValue;
  }
};

// iterations is [1, 2, 4] = first element in Loop, then in this Loop, second element, then the fourth
export const reverseDeepValueForCheckboxGroup = vecteur => iterations => {
  const [firstVal, ...otherVals] = iterations;
  if (iterations.length > 1) {
    reverseDeepValueForCheckboxGroup(vecteur[firstVal])(otherVals);
  } else {
    if (Array.isArray(vecteur)) vecteur[firstVal] = !vecteur[firstVal];
    else vecteur = !vecteur;
  }
};

/**
 * This function returns the list of variables collected by a component
 * (regardless of their state).
 * @param {*} component (single Component)
 */
export const getResponsesNameFromComponent = component => {
  if (component?.componentType && !['CheckboxGroup', 'Table'].includes(component?.componentType)) {
    const { response } = component;
    return response ? [response.name] : [];
  }
  if (component?.componentType && component?.componentType === 'CheckboxGroup') {
    const { responses } = component;
    return responses.reduce((_, response) => {
      return [..._, response.response.name];
    }, []);
  }
  if (component?.componentType && component?.componentType === 'Table') {
    return component?.cells.reduce((_, line) => {
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
  const reponsesName = getResponsesNameFromComponent(component);
  const { variables } = questionnaire;
  const { COLLECTED, ...other } = variables;
  const newCOLLECTED = Object.entries(COLLECTED).reduce((init, [name, values]) => {
    const newVar = init;
    if (reponsesName.includes(name)) {
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
