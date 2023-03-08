import * as lunatic from '@inseefr/lunatic';

import { sendCompletedEvent, sendStartedEvent, sendValidatedEvent } from 'utils/communication';
import { useCallback, useEffect, useRef, useState } from 'react';

export const NOT_STARTED = null;
export const INIT = 'INIT';
export const COMPLETED = 'COMPLETED';
export const VALIDATED = 'VALIDATED';

// TODO lunatic V2 : should questionnaire passed as prop => delegate to lunatic is cleaner archi
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
        console.log(' => ', INIT);
        changeState(INIT);
      } else if (
        stateRef.current === VALIDATED &&
        initialDataRef.current !== JSON.stringify(newData)
      ) {
        // state VALIDATED et données entrantes !== données initiales
        console.log('state ', VALIDATED, ' => ', INIT);
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

// Manage validatedPages (for rereading for example)
export const useValidatedPages = (initPage, questionnaire, bindings) => {
  const [validatedPages, setValidatedPages] = useState(() => {
    const initPageInt = parseInt((initPage || '0').split('.')[0], 10);
    return questionnaire.components.reduce((_, { conditionFilter, page }) => {
      if (!conditionFilter ? true : lunatic.interpret(['VTL'])(bindings)(conditionFilter?.value)) {
        if (page) {
          const pageInt = parseInt(page.split('.')[0], 10);

          if (pageInt <= initPageInt && !_.includes(page)) return [..._, page];
        }
      }
      return _;
    }, []);
  });

  const addValidatedPage = page => {
    if (!validatedPages.includes(page)) {
      validatedPages.push(page);
      setValidatedPages(validatedPages);
      return [...validatedPages, page];
    }
    return validatedPages;
  };
  return [validatedPages, addValidatedPage];
};
