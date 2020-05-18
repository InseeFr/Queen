import * as CONST from 'utils/constants';
import * as lunatic from '@inseefr/lunatic';

export const buildSpecialQueenData = data => {
  const specialQueenData = { DOESNT_KNOW: [], REFUSAL: [] };
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
          specialQueenData[CONST.DOESNT_KNOW] = [...specialQueenData[CONST.DOESNT_KNOW], value];
          break;
        case CONST.REFUSAL_LABEL:
          specialQueenData[CONST.REFUSAL] = [...specialQueenData[CONST.REFUSAL], value];
          break;
        default:
          break;
      }
    });
  }
  return { data: { COLLECTED: newCOLLECTED, EXTERNAL, CALCULATED }, specialQueenData };
};

export const getStateToSave = questionnaire => specialQueenData => {
  const { DOESNT_KNOW, REFUSAL } = { ...specialQueenData };
  const state = lunatic.getState(questionnaire);
  DOESNT_KNOW.forEach(varName => {
    state.COLLECTED[varName].COLLECTED = CONST.DOESNT_KNOW_LABEL;
  });
  REFUSAL.forEach(varName => {
    state.COLLECTED[varName].COLLECTED = CONST.REFUSAL_LABEL;
  });
  return state;
};

export const removeResponseToSpecialQueenData = specialQueenData => responseName => {
  const newSpecialQueenData = { ...specialQueenData };
  CONST.QUEEN_DATA_KEYS.forEach(key => {
    newSpecialQueenData[key] = newSpecialQueenData[key].filter(name => name !== responseName);
  });
  return newSpecialQueenData;
};

export const addResponseToSpecialQueenData = specialQueenData => responseName => dataType => {
  const newSpecialQueenData = removeResponseToSpecialQueenData(specialQueenData)(responseName);
  if (!newSpecialQueenData[dataType].includes(responseName)) {
    newSpecialQueenData[dataType] = [...newSpecialQueenData[dataType], responseName];
  }
  return newSpecialQueenData;
};

/**
 * @param {*} specialQueenData
 * @param {Array} responses
 */
export const isInSpecialQueenDataRefusal = specialQueenData => responses => {
  return specialQueenData[CONST.REFUSAL].some(v => responses.indexOf(v) !== -1);
};

/**
 * @param {*} specialQueenData
 * @param {Array} responses
 */
export const isInSpecialQueenDataDoesntKnow = specialQueenData => responses => {
  return specialQueenData[CONST.DOESNT_KNOW].some(v => responses.indexOf(v) !== -1);
};

/**
 * @param {*} specialQueenData
 * @param {Array} responses
 */
export const isInSpecialQueenData = specialQueenData => responses => {
  return specialQueenData
    ? isInSpecialQueenDataRefusal(specialQueenData)(responses) ||
        isInSpecialQueenDataDoesntKnow(specialQueenData)(responses)
    : false;
};
