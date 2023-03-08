import { useEffect, useRef } from 'react';

import { useLocation } from 'react-router-dom';

export * from './auth';
export * from './api';
export * from './serviceWorker';
export * from './configuration';

/**
 * Use search params in current URL to find local resources url to properly load an orchestrator
 *
 */
export const useVisuQuery = () => {
  const searchUrl = new URLSearchParams(useLocation().search);
  const questionnaireUrl = searchUrl.get('questionnaire');
  const dataUrl = searchUrl.get('data');
  const readonly = searchUrl.get('readonly') === `true`;
  const stringNomenclature = searchUrl.get('nomenclature');
  return {
    questionnaireUrl,
    dataUrl,
    readonly,
    nomenclatures: JSON.parse(stringNomenclature),
  };
};

// https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
// hooks use for synchronization
export const useAsyncValue = f => {
  const refreshFunction = useRef(f);
  useEffect(() => {
    refreshFunction.current = f;
  }, [f]);
  return refreshFunction.current;
};

export const usePrevious = (value, initial) => {
  const ref = useRef({ target: value, previous: initial });

  if (ref.current.target !== value) {
    ref.current.previous = ref.current.target;
    ref.current.target = value;
  }

  return ref.current.previous;
};
