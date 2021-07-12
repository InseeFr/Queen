import * as lunatic from '@inseefr/lunatic';

export const getStateToSave = questionnaire => lunatic.getState(questionnaire);
export const getNotNullCollectedState = questionnaire =>
  lunatic.getCollectedStateByValueType(questionnaire)('COLLECTED', false);
