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

export const buildQueenData = data => {
  const queenData = { DOESNT_KNOW: [], REFUSAL: [] };
  const { COLLECTED, EXTERNAL, CALCULATED } = { ...data };
  const newCOLLECTED = {};
  if (COLLECTED) {
    const collectedVarName = Object.keys(COLLECTED);
    collectedVarName.forEach(value => {
      if ([CONST.DOESNT_KNOW_LABEL, CONST.REFUSAL_LABEL].includes(COLLECTED[value].COLLECTED)) {
        const temp = { ...COLLECTED[value] };
        temp.COLLECTED = null;
        newCOLLECTED[value] = temp;
      } else {
        newCOLLECTED[value] = COLLECTED[value];
      }
      switch (COLLECTED[value].COLLECTED) {
        case CONST.DOESNT_KNOW_LABEL:
          queenData[CONST.DOESNT_KNOW] = [...queenData[CONST.DOESNT_KNOW], value];
          break;
        case CONST.REFUSAL_LABEL:
          queenData[CONST.REFUSAL] = [...queenData[CONST.REFUSAL], value];
          break;
        default:
          break;
      }
    });
  }
  return { data: { COLLECTED: newCOLLECTED, EXTERNAL, CALCULATED }, queenData };
};

export const getStateToSave = questionnaire => queenData => {
  const { DOESNT_KNOW, REFUSAL } = { ...queenData };
  const state = lunatic.getState(questionnaire);
  DOESNT_KNOW.forEach(varName => {
    state.COLLECTED[varName].COLLECTED = CONST.DOESNT_KNOW_LABEL;
  });
  REFUSAL.forEach(varName => {
    state.COLLECTED[varName].COLLECTED = CONST.REFUSAL_LABEL;
  });
  return state;
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
