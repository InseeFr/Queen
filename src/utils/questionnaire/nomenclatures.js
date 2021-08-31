const buildSuggester = apiUrl => id => {
  return {
    id,
    url: `${apiUrl}/api/nomenclature/${id}`,
  };
};

export const buildSuggesterFromNomenclatures = apiUrl => (nomenclatures = []) => {
  if (Array.isArray(nomenclatures)) {
    return nomenclatures.map(nomenclature => buildSuggester(apiUrl)(nomenclature));
  }
  return [];
};
