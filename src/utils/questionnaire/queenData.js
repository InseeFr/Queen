import * as CONST from 'utils/constants';
import * as lunatic from '@inseefr/lunatic';
import { getResponsesNameFromComponent, getCollectedResponse } from './queen';

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

export const removeResponseToQueenData = queenData => responseName => {
  const newQueenData = { ...queenData };
  CONST.QUEEN_DATA_KEYS.forEach(key => {
    newQueenData[key] = newQueenData[key].filter(name => name !== responseName);
  });
  return newQueenData;
};

export const addResponseToQueenData = queenData => responseName => dataType => {
  const newQueenData = removeResponseToQueenData(queenData)(responseName);
  if (!newQueenData[dataType].includes(responseName)) {
    newQueenData[dataType] = [...newQueenData[dataType], responseName];
  }
  return newQueenData;
};

/**
 * @param {*} queenData
 * @param {Array} responses
 */
export const isInQueenDataRefusal = queenData => responses => {
  return queenData[CONST.REFUSAL].some(v => responses.indexOf(v) !== -1);
};

/**
 * @param {*} queenData
 * @param {Array} responses
 */
export const isInQueenDataDoesntKnow = queenData => responses => {
  return queenData[CONST.DOESNT_KNOW].some(v => responses.indexOf(v) !== -1);
};

/**
 * @param {*} queenData
 * @param {Array} responses
 */
export const isInQueenData = queenData => responses => {
  return (
    isInQueenDataRefusal(queenData)(responses) || isInQueenDataDoesntKnow(queenData)(responses)
  );
};
