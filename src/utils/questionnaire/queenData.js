export const buildData = queenData => {
  const data = {};
  data.COLLECTED = queenData.COLLECTED.reduce((collectedObj, collectedVar) => {
    const newCollected = collectedObj;
    const { name, ...content } = collectedVar;
    newCollected[name] = { ...content };
    return newCollected;
  }, {});
  data.EXTERNAL = queenData.EXTERNAL.reduce((externalObj, externalVar) => {
    const newExternal = externalObj;
    const { name, value } = externalVar;
    newExternal[name] = value;
    return newExternal;
  }, {});
  return data;
};

export const buildQueenData = data => {
  const queenData = {};
  queenData.COLLECTED = Object.entries(data.COLLECTED).reduce((_, [name, content]) => {
    return [
      ..._,
      {
        name,
        ...content,
      },
    ];
  }, []);
  queenData.EXTERNAL = Object.entries(data.EXTERNAL).reduce((_, [name, value]) => {
    return [
      ..._,
      {
        name,
        value,
      },
    ];
  }, []);
  return queenData;
};
