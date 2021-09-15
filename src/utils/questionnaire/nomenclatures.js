const buildSuggesterUrl = apiUrl => id => { return {url:`${apiUrl}/api/nomenclature/${id}`}};

export const buildSuggesterFromNomenclatures = apiUrl => (nomenclatures = []) => {
  console.log(JSON.stringify(nomenclatures));
  if (Array.isArray(nomenclatures)) {
    return nomenclatures.reduce((suggesters, nomenclature) => {
      return { ...suggesters, [nomenclature]: buildSuggesterUrl(apiUrl)(nomenclature) };
    }, {});
  }
  return {};
};
