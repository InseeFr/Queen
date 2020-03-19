export const findPageIndex = components => page =>
  components ? components.findIndex(c => c.page === page) : -1;

export const getPreviousPage = components => currentPage => {
  if (!components || !currentPage) return 1;
  const index = findPageIndex(components)(currentPage);
  if (index <= 0) return 1;
  return components[index - 1].page || 1;
};

export const getNextPage = components => currentPage => {
  if (!components || !currentPage) return 1;
  const index = findPageIndex(components)(currentPage);
  if (index < 0 || index >= components.length - 1) return 1;
  return components[index + 1].page || 1;
};
