import D from 'i18n';
import * as CONST from 'utils/constants';
import * as lunatic from '@inseefr/lunatic';

/**
 * Function to build Queen questionnaire.
 * We add attribute to components
 *   - page : the queen page
 *   -
 * @param {*} components
 */
export const buildQueenQuestionnaire = components => {
  let seq;
  let idSeq;
  let subseq;
  let idSubseq;
  return Array.isArray(components)
    ? components.reduce((_, component) => {
        const { componentType, label, id, declarations } = component;
        if (componentType && !['Sequence', 'Subsequence'].includes(componentType))
          return [
            ..._,
            {
              ...component,
              idSequence: idSeq,
              idSubsequence: idSubseq,
              sequence: seq,
              subsequence: subseq,
              page: _.length + 1,
            },
          ];
        if (componentType === 'Sequence') {
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
              page: _.length + 1,
            },
          ];
        }
        if (componentType === 'Subsequence') {
          idSubseq = id;
          subseq = label;
          /**
           * if there is no declarations, we delete this component
           */
          if (!declarations || declarations.length === 0) {
            return _;
          }
          return [
            ..._,
            {
              ...component,
              labelNav: label,
              label: '',
              sequence: seq,
              subsequence: subseq,
              idSequence: idSeq,
              page: _.length + 1,
            },
          ];
        }
        return _;
      }, [])
    : [];
};

export const getResponsesNameFromComponent = component => {
  const { componentType } = component;
  if (componentType && !['CheckboxGroup', 'Table'].includes(componentType)) {
    const { response } = component;
    return response ? [response['name']] : [];
  }
  if (componentType && componentType === 'CheckboxGroup') {
    const { responses } = component;
    return responses.reduce((_, response) => {
      return [..._, response['response']['name']];
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

export const getResponsesLinkWith = components => response => {
  return components.reduce((_, component) => {
    const { conditionFilter } = component;
    if (conditionFilter) {
      const responses = conditionFilter.includes(response)
        ? getResponsesNameFromComponent(component)
        : [];
      return [..._, ...responses];
    }
    return _;
  }, []);
};

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
