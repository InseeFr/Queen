const prefixEvent = 'QUEEN';

const dispatchQueenEventWithData = data => {
  const event = new CustomEvent(prefixEvent, { detail: data });
  window.dispatchEvent(event);
  console.log('event send');
  console.log(event);
};

export const sendCloseEvent = () => {
  const data = {
    type: prefixEvent,
    command: 'CLOSE_QUEEN',
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
