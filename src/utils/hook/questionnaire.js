import * as lunatic from '@inseefr/lunatic';

import { sendCompletedEvent, sendStartedEvent, sendValidatedEvent } from 'utils/communication';
import { useCallback, useState } from 'react';

export const NOT_STARTED = null;
export const INIT = 'INIT';
export const COMPLETED = 'COMPLETED';
export const VALIDATED = 'VALIDATED';

// TODO lunatic V2 : should questionnaire passed as prop => delegate to lunatic is cleaner archi
export const useQuestionnaireState = (idSurveyUnit, initialData, initialState = null) => {
  const [state, setState] = useState(initialState);

  const [initData, setInitData] = useState(initialData);

  // Send an event when questionnaire's state has changed (started, completed, validated)
  const changeState = useCallback(
    newState => {
      if (state === INIT) sendStartedEvent(idSurveyUnit);
      if (state === COMPLETED) sendCompletedEvent(idSurveyUnit);
      if (state === VALIDATED) sendValidatedEvent(idSurveyUnit);
      setState(newState);
    },
    [idSurveyUnit, state]
  );
  const onDataChange = useCallback(
    newData => {
      //initialisation des data de référence
      if (initData === undefined) {
        console.log('my first data');
        setInitData(JSON.stringify(newData));
      } else if (state === NOT_STARTED) {
        changeState(INIT);
      } else if (state === VALIDATED && initData !== JSON.stringify(newData)) {
        changeState(INIT);
      }
    },
    [changeState, initData, state]
  );

  // Analyse collected variables to update state (only to STARTED state)

  return [state, changeState, onDataChange];
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
