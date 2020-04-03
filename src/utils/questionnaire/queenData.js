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

const removeResponseToQueenData = queenData => responseName => {
  const newQueenData = { ...queenData };
  CONST.QUEEN_DATA_KEYS.forEach(key => {
    newQueenData[key] = newQueenData[key].filter(name => name !== responseName);
  });
  return newQueenData;
};

export const addResponseToQueenData = queenData => responseName => dataType => {
  const newQueenData = { ...queenData };
  if (!newQueenData[dataType].includes(responseName)) {
    newQueenData[dataType] = [...newQueenData[dataType], responseName];
  }
  return newQueenData;
};

export const updateQueenData = queenData => currentComponent => {
  let newQueenData = { ...queenData };
  const { componentType } = currentComponent;
  const responsesName = getResponsesNameFromComponent(currentComponent);
  responsesName.forEach(responseName => {
    const collectedResponse = getCollectedResponse(currentComponent);
    if (
      Object.keys(collectedResponse).length === 0 &&
      !['CheckboxBoolean'].includes(componentType)
    ) {
      newQueenData = addResponseToQueenData(newQueenData)(responseName)(CONST.DOESNT_KNOW);
    } else {
      newQueenData = removeResponseToQueenData(newQueenData)(responseName);
    }
  });
  return newQueenData;
};
