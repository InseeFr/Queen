export const getPageWithoutAnyIteration = currentPage =>
  currentPage
    .split('.')
    .map(e => e.split('#')[0])
    .join('.');

export const getMaxValidatedPage = pages => pages[pages.length - 1];

const filterPageLoop = currentPage => ({ page, componentType }) => {
  const currentPageWithoutIteration = getPageWithoutAnyIteration(currentPage);
  return currentPageWithoutIteration.startsWith(page) && componentType === 'Loop';
};

export const getMaxPages = components => currentPage => localMaxPage => {
  const filterComponentsLoop = components.filter(c => filterPageLoop(currentPage)(c));
  if (filterComponentsLoop.length > 0) {
    const { maxPage, components: componentsOfLoop } = filterComponentsLoop[0];
    if (maxPage) return [localMaxPage, ...getMaxPages(componentsOfLoop)(currentPage)(maxPage)];
  }
  return [localMaxPage];
};

export const getCurrentComponent = components => currentPage => {
  const currentPageWithoutIteration = getPageWithoutAnyIteration(currentPage);
  const filterComponentsLoop = components.filter(c => filterPageLoop(currentPage)(c));
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
  return currentPage.split('.').reduce((_, e) => {
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

const getCurrentOccurrences = components => bindings => currentPage => {
  const filterComponentsLoop = components.filter(c => filterPageLoop(currentPage)(c));
  if (filterComponentsLoop.length > 0) {
    const { loopDependencies, components: componentsOfLoop } = filterComponentsLoop[0];
    if (loopDependencies) {
      const queenBindings = getQueenBindings(bindings)(currentPage);
      return [
        loopDependencies.map(variable => queenBindings[variable]),
        ...getCurrentOccurrences(componentsOfLoop)(bindings)(currentPage),
      ];
    }
  }
  return [];
};

export const getInfoFromCurrentPage = components => bindings => currentPage => maxPage => {
  const occurences = getCurrentOccurrences(components)(bindings)(currentPage);
  const iterations = getIterations(currentPage);
  const maxLocalPages = getMaxPages(components)(currentPage)(maxPage);
  const currentComponent = getCurrentComponent(components)(currentPage);
  return { maxLocalPages, occurences, currentComponent, iterations };
};
