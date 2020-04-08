import D from 'i18n';
import * as lunatic from '@inseefr/lunatic';

/**
 * Function to build Queen questionnaire.
 * It adds attribute to components
 *   - page : the queen page
 * It removes empty subsequence
 * It changes declarations of empty sequence to 'Changing the sequence'
 * @param {Array} components
 */
export const buildQueenQuestionnaire = components => {
  let seq;
  let idSeq;
  let subseq;
  let idSubseq;
  let currentPage = 0;
  return Array.isArray(components)
    ? components.reduce((_, component) => {
        const { componentType, label, id, declarations } = component;
        if (componentType && !['Sequence', 'Subsequence'].includes(componentType)) {
          currentPage += 1;
          return [
            ..._,
            {
              ...component,
              idSequence: idSeq,
              idSubsequence: idSubseq,
              sequence: seq,
              subsequence: subseq,
              page: currentPage,
            },
          ];
        }
        if (componentType === 'Sequence') {
          currentPage += 1;
          idSeq = id;
          seq = label;
          subseq = '';
          idSubseq = '';
          /**
           * if there is no declarations, we display a new declaration : D.newSequenceComment (cf Dictionary)
           */
          const newDeclarations =
            !declarations || declarations.length === 0
              ? [
                  {
                    id: `${id}-d1`,
                    declarationType: 'COMMENT',
                    position: 'AFTER_QUESTION_TEXT',
                    label: D.newSequenceComment,
                  },
                ]
              : declarations;
          return [
            ..._,
            {
              ...component,
              labelNav: label,
              label: '',
              declarations: newDeclarations,
              sequence: seq,
              page: currentPage,
            },
          ];
        }
        if (componentType === 'Subsequence') {
          idSubseq = id;
          subseq = label;
          /**
           * if there is no declarations, we "delete" this component
           */
          if (!declarations || declarations.length === 0) {
            return [..._, { ...component, goToPage: currentPage + 1 }];
          }
          currentPage += 1;
          return [
            ..._,
            {
              ...component,
              labelNav: label,
              label: '',
              sequence: seq,
              subsequence: subseq,
              idSequence: idSeq,
              page: currentPage,
            },
          ];
        }
        return _;
      }, [])
    : [];
};

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

export const getCollectedResponse = component => {
  const fakeQuestionnaire = { components: [component] };
  return lunatic.getCollectedStateByValueType(fakeQuestionnaire)('COLLECTED');
};

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
      const responses = regexpTest.test(conditionFilter)
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
