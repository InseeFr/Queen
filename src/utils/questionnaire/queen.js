import * as lunatic from '@inseefr/lunatic';
import { DIRECT_CONTINUE_COMPONENTS } from 'utils/constants';

export const getCalculatedVariablesFromSource = source => {
  return source.variables.reduce((_, { variableType, name }) => {
    if (variableType === 'CALCULATED') return [..._, name];
    return _;
  }, []);
};

export const secureCopy = objectToCopy => JSON.parse(JSON.stringify(objectToCopy));

export const haveToGoNext = (currentComponentType, updateValue) => {
  const keys = Object.keys(updateValue);
  return (
    keys.length > 0 &&
    haveNotNullUpdate(updateValue) &&
    DIRECT_CONTINUE_COMPONENTS.includes(currentComponentType) &&
    keys.filter(v => v.includes('MISSING')).length === 0
  );
};
export const haveNotNullUpdate = updateValue => {
  return (
    typeof updateValue === 'object' &&
    updateValue !== null &&
    Object.values(updateValue).filter(v => !!v).length > 0
  );
};
/**
 * This function returns the list of variables collected by a component
 * (regardless of their state).
 * @param {*} component (single Component)
 */
export const getResponsesNameFromComponent = component => {
  if (
    component?.componentType &&
    !['CheckboxGroup', 'Table', 'Loop'].includes(component?.componentType)
  ) {
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
  if (component?.componentType && component?.componentType === 'Loop') {
    const { components } = component;
    return components.reduce((_, comp) => {
      return [..._, ...getResponsesNameFromComponent(comp)];
    }, []);
  }
  return [];
};

export const getMissingResponseNameFromComponent = component => {
  if (component?.componentType && component?.componentType === 'Loop') {
    const { components } = component;
    return components.reduce((_, comp) => {
      return [..._, getMissingResponseNameFromComponent(comp)];
    }, []);
  }
  return [component?.missingResponse?.name];
};

export const getResponseOfComponent =
  questionnaire =>
  component =>
  (type = 'COLLECTED') =>
  (missing = false) => {
    const reponsesName = missing
      ? getMissingResponseNameFromComponent(component)
      : getResponsesNameFromComponent(component);
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

export const getComponentResponse = questionnaire => component => type => {
  return getResponseOfComponent(questionnaire)(component)(type)(false);
};
export const getComponentResponseMissing = questionnaire => component => type => {
  return getResponseOfComponent(questionnaire)(component)(type)(true);
};

export const getIterationValue = values => iterations => {
  const [firstVal, ...otherVals] = iterations;
  if (iterations.length > 1) {
    getIterationValue(values[firstVal])(otherVals);
  } else {
    if (Array.isArray(values)) return values[firstVal];
    else return values;
  }
};
