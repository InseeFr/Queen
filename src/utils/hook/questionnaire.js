import { sendCompletedEvent, sendStartedEvent, sendValidatedEvent } from 'utils/communication';
import { useCallback, useRef } from 'react';

export const NOT_STARTED = null;
export const INIT = 'INIT';
export const COMPLETED = 'COMPLETED';
export const VALIDATED = 'VALIDATED';

export const useQuestionnaireState = (idSurveyUnit, initialData, initialState = NOT_STARTED) => {
  console.log('useQuestionnaireState', { idSurveyUnit, initialData, initialState });
  const stateRef = useRef(initialState);
  const getState = useCallback(() => stateRef.current, []);

  const initialDataRef = useRef(initialData);

  // Send an event when questionnaire's state has changed (started, completed, validated)
  const changeState = useCallback(
    newState => {
      console.log('change state to ', newState);
      if (newState === INIT) sendStartedEvent(idSurveyUnit);
      if (newState === COMPLETED) sendCompletedEvent(idSurveyUnit);
      if (newState === VALIDATED) sendValidatedEvent(idSurveyUnit);
      stateRef.current = newState;
    },
    [idSurveyUnit]
  );
  const onDataChange = useCallback(
    newData => {
      // initialisation des data de référence
      if (initialDataRef.current === undefined) {
        console.log('persisting initial data');
        initialDataRef.current = JSON.stringify(newData);
      }

      if (stateRef.current === NOT_STARTED) {
        changeState(INIT);
      } else if (
        stateRef.current === VALIDATED &&
        initialDataRef.current !== JSON.stringify(newData)
      ) {
        // state VALIDATED et données entrantes !== données initiales
        changeState(INIT);
      } else {
        // here we do nothing
        console.log({ newData, state: stateRef.current });
      }
    },
    [changeState]
  );

  // Analyse collected variables to update state (only to STARTED state)

  return [getState, changeState, onDataChange];
};
