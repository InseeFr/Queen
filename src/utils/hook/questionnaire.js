import { useEffect, useState } from 'react';
import * as lunatic from '@inseefr/lunatic';
import * as UQ from 'utils/questionnaire';
import { sendCompletedEvent, sendStartedEvent, sendValidatedEvent } from 'utils/communication';
import { getNotNullCollectedState } from 'utils/questionnaire';

export const NOT_STARTED = null;
export const INIT = 'INIT';
export const COMPLETED = 'COMPLETED';
export const VALIDATED = 'VALIDATED';

export const useQuestionnaireState = (questionnaire, initialState = null, idSurveyUnit) => {
  const [changingState, setChangingState] = useState(false);
  const [state, setState] = useState(initialState);

  const [initialResponse] = useState(() => JSON.stringify(getNotNullCollectedState(questionnaire)));

  const changeState = newState => {
    setChangingState(true);
    setState(newState);
  };

  // Analyse collected variables to update state (only to STARTED state)
  useEffect(() => {
    if (questionnaire && (state === NOT_STARTED || state === VALIDATED)) {
      const dataCollected = getNotNullCollectedState(questionnaire);
      // TODO : make a better copy without mutate questionnaire object (spread doesn't work)
      const dataWithoutNullArray = Object.entries(UQ.secureCopy(dataCollected)).filter(
        ([, value]) => {
          if (Array.isArray(value)) {
            if ((value.length = 1 && value[0] === null)) return false;
          }
          return true;
        }
      );
      if (
        (state === VALIDATED &&
          dataWithoutNullArray.length > 0 &&
          JSON.stringify(dataCollected) !== initialResponse) ||
        (state === NOT_STARTED && dataWithoutNullArray.length > 0)
      ) {
        changeState(INIT);
      }
    }

    // Assume we want to update only this when questionnaire is updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionnaire]);

  // Send an event when questionnaire's state has changed (started, completed, validated)
  useEffect(() => {
    if (changingState) {
      if (state === INIT) sendStartedEvent(idSurveyUnit);
      if (state === COMPLETED) sendCompletedEvent(idSurveyUnit);
      if (state === VALIDATED) sendValidatedEvent(idSurveyUnit);
      setChangingState(false);
    }
  }, [state, idSurveyUnit, changingState]);

  return [state, changeState];
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
