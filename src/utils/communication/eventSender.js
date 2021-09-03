const prefixEvent = 'QUEEN';

const dispatchQueenEventWithData = data => {
  const event = new window.CustomEvent(prefixEvent, { detail: data });
  console.log(event);
  window.dispatchEvent(event);
};

export const sendCloseEvent = idSU => {
  const data = {
    type: prefixEvent,
    command: 'CLOSE_QUEEN',
    surveyUnit: idSU,
  };
  dispatchQueenEventWithData(data);
};

export const sendCompletedEvent = idSU => {
  const data = {
    type: prefixEvent,
    command: 'UPDATE_SURVEY_UNIT',
    surveyUnit: idSU,
    state: 'COMPLETED',
  };
  dispatchQueenEventWithData(data);
};

export const sendValidatedEvent = idSU => {
  const data = {
    type: prefixEvent,
    command: 'UPDATE_SURVEY_UNIT',
    surveyUnit: idSU,
    state: 'VALIDATED',
  };
  dispatchQueenEventWithData(data);
};

export const sendStartedEvent = idSU => {
  const data = {
    type: prefixEvent,
    command: 'UPDATE_SURVEY_UNIT',
    surveyUnit: idSU,
    state: 'STARTED',
  };
  dispatchQueenEventWithData(data);
};

export const sendSynchronizeEvent = state => {
  const data = {
    type: prefixEvent,
    command: 'UPDATE_SYNCHRONIZE',
    state,
  };
  dispatchQueenEventWithData(data);
};

export const sendReadyEvent = () => {
  const data = {
    type: prefixEvent,
    command: 'HEALTH_CHECK',
    state: 'READY',
  };
  dispatchQueenEventWithData(data);
};

export const sendNotReadyEvent = () => {
  const data = {
    type: prefixEvent,
    command: 'HEALTH_CHECK',
    state: 'NOT_READY',
  };
  dispatchQueenEventWithData(data);
};
