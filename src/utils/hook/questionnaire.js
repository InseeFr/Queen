import { useEffect, useState } from 'react';
import * as lunatic from '@inseefr/lunatic';
import { sendCompletedEvent, sendStartedEvent, sendValidatedEvent } from 'utils/communication';
import { getNotNullCollectedState } from 'utils/questionnaire';

export const NOT_STARTED = 'NOT_STARTED';
export const STARTED = 'STARTED';
export const VALIDATED = 'VALIDATED';
export const COMPLETED = 'COMPLETED';

export const useQuestionnaireState = (questionnaire, initialState, idSurveyUnit) => {
  const [state, setState] = useState(initialState);

  // Analyse collected variables to update state (only to STARTED state)
  useEffect(() => {
    if (questionnaire && (state === NOT_STARTED || state === VALIDATED)) {
      const dataCollected = getNotNullCollectedState(questionnaire);
      // TODO : make a better copy without mutate questionnaire object (spread doesn't work)
      const dataWithoutNullArray = Object.entries(JSON.parse(JSON.stringify(dataCollected))).filter(
        ([, value]) => {
          if (Array.isArray(value)) {
            if ((value.length = 1 && value[0] === null)) return false;
          }
          return true;
        }
      );
      if (dataWithoutNullArray.length > 0) setState(STARTED);
    }
  }, [questionnaire, state]);

  // Send an event when questionnaire's state has changed (started, completed, validated)
  useEffect(() => {
    if (state === STARTED) sendStartedEvent(idSurveyUnit);
    if (state === COMPLETED) sendCompletedEvent(idSurveyUnit);
    if (state === VALIDATED) sendValidatedEvent(idSurveyUnit);
  }, [state, idSurveyUnit]);

  return [state, setState];
};

// Manage validatedPages (for rereading for example)
export const useValidatedPages = (initPage, questionnaire, bindings) => {
  const [validatedPages, setValidatedPages] = useState(() => {
    const initPageInt = parseInt((initPage || '0').split('.')[0], 10);
    return questionnaire.components.reduce((_, { conditionFilter, page }) => {
      if (
        !conditionFilter
          ? true
          : lunatic.interpret(['VTL'])(bindings, true)(conditionFilter) === 'normal'
      ) {
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
      setValidatedPages([...validatedPages, page]);
      return [...validatedPages, page];
    }
    return validatedPages;
  };
  return [validatedPages, addValidatedPage];
};
