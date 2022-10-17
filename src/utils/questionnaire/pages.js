import { getMissingResponseNameFromComponent, getResponsesNameFromComponent } from './queen';

export const getPageWithoutAnyIteration = currentPage =>
  currentPage
    .split('.')
    .map(e => e.split('#')[0])
    .join('.');

export const getMaxValidatedPage = pages => pages[pages.length - 1];

const filterPageLoop =
  currentPage =>
  ({ page, componentType }) => {
    const currentPageWithoutIteration = getPageWithoutAnyIteration(currentPage);
    return currentPageWithoutIteration.startsWith(page) && componentType === 'Loop';
  };

export const getMaxPages = components => currentPage => localMaxPage => {
  const filterComponentsLoop = components?.filter(c => filterPageLoop(currentPage)(c));
  if (filterComponentsLoop.length > 0) {
    const { maxPage, components: componentsOfLoop } = filterComponentsLoop[0];
    if (maxPage) return [localMaxPage, ...getMaxPages(componentsOfLoop)(currentPage)(maxPage)];
  }
  return [localMaxPage];
};

export const getCurrentComponent = components => currentPage => {
  const currentPageWithoutIteration = getPageWithoutAnyIteration(currentPage);
  const filterComponentsLoop = components?.filter(c => filterPageLoop(currentPage)(c));
  if (filterComponentsLoop.length > 0) {
    const { maxPage, components: componentsOfLoop } = filterComponentsLoop[0];
    if (maxPage) return getCurrentComponent(componentsOfLoop)(currentPage);
  }
  return components
    .filter(
      ({ page, componentType }) =>
        page === currentPageWithoutIteration && componentType !== 'FilterDescription'
    )
    .pop();
};

export const getIterations = currentPage => {
  return currentPage?.split('.').reduce((_, e) => {
    const splitted = e.split('#');
    if (splitted.length > 1) return [..._, parseInt(splitted[1], 10)];
    return _;
  }, []);
};

const getDepthBindings = values => indexes => {
  if (Array.isArray(values) && indexes.length > 0) {
    const [firstIndex, ...other] = indexes;
    return getDepthBindings(values[firstIndex])(other);
  }
  return values;
};

export const getQueenBindings = bindings => currentPage => {
  const indexes = getIterations(currentPage).map(i => i - 1);
  const keysBindings = Object.keys(bindings);
  const newBindings = {};
  keysBindings.forEach(k => {
    if (Array.isArray(bindings[k])) {
      newBindings[k] = getDepthBindings(bindings[k])(indexes);
    } else {
      newBindings[k] = bindings[k];
    }
  });
  return newBindings;
};

const getCurrentOccurrences = components => queenBindings => currentPage => {
  const filterComponentsLoop = components?.filter(c => filterPageLoop(currentPage)(c));
  if (filterComponentsLoop.length > 0) {
    const {
      loopDependencies,
      components: componentsOfLoop,
      paginatedLoop,
    } = filterComponentsLoop[0];
    if (loopDependencies && paginatedLoop) {
      return [
        loopDependencies.map(variable => queenBindings[variable]),
        ...getCurrentOccurrences(componentsOfLoop)(queenBindings)(currentPage),
      ];
    }
  }
  return [];
};

const getBindindsOfLoop = (components, calculatedVariables) => bindings => currentPage => {
  const filterComponentsLoop = components?.filter(c => filterPageLoop(currentPage)(c));
  if (filterComponentsLoop.length > 0) {
    const {
      loopDependencies,
      bindingDependencies,
      // components: componentsOfLoop,
      paginatedLoop,
    } = filterComponentsLoop[0];
    if (loopDependencies && paginatedLoop) {
      return {
        loopBindings: loopDependencies.reduce((acc, name) => {
          acc[name] = bindings[name];
          return acc;
        }, {}),
        responseBindings: bindingDependencies.reduce((acc, name) => {
          if (!loopDependencies.includes(name) && !calculatedVariables.includes(name))
            acc[name] = bindings[name];
          return acc;
        }, {}),
      };
    }
  }
  return {};
};

const getAllFirstAllPages = loopBindings => currentPage => {
  const { loopBindings: varsOfLoop = {} } = loopBindings;
  const pageWithoutAnyIteration = getPageWithoutAnyIteration(currentPage);
  const rootPageLoop = pageWithoutAnyIteration.split('.')[0];
  if (Object.values(varsOfLoop).length > 0)
    return Object.values(varsOfLoop)[0].map((curr, i) => `${rootPageLoop}.1#${i + 1}`);
  return [];
};

export const getInfoFromCurrentPage =
  (components, calculatedVariables) => bindings => currentPage => maxPage => {
    const queenBindings = getQueenBindings(bindings)(currentPage);
    const occurences = getCurrentOccurrences(components)(queenBindings)(currentPage);
    const maxLocalPages = getMaxPages(components)(currentPage)(maxPage);
    const currentComponent = getCurrentComponent(components)(currentPage);
    const depth = (currentPage?.match(/\./g) || []).length;
    const occurencesIndex = getIterations(currentPage).map(i => i - 1);
    const loopBindings = getBindindsOfLoop(components, calculatedVariables)(bindings)(currentPage);
    const allFirstLoopPages = getAllFirstAllPages(loopBindings)(currentPage);
    return {
      maxLocalPages,
      occurences,
      currentComponent,
      depth,
      occurencesIndex,
      loopBindings,
      queenBindings,
      allFirstLoopPages,
    };
  };

export const canGoNext = currentComponent => queenBindings => {
  if (!currentComponent) return false;
  const { componentType } = currentComponent;
  if (componentType === 'Sequence' || componentType === 'Subsequence') return true;
  const responses = [
    ...getResponsesNameFromComponent(currentComponent),
    ...getMissingResponseNameFromComponent(currentComponent),
  ]
    .reduce((_, name) => [..._, queenBindings[name]].flat(10), [])
    .filter(value => ![null, undefined].includes(value));

  return responses.length > 0;
};
