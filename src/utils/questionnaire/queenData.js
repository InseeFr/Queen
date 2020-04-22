export const buildData = queenData => {
  const data = {};
  data.COLLECTED = queenData.COLLECTED.reduce((collectedObj, { name, type, ...content }) => {
    const newCollected = collectedObj;
    newCollected[name] = { ...content };
    return newCollected;
  }, {});
  data.EXTERNAL = queenData.EXTERNAL.reduce((externalObj, { name, value }) => {
    const newExternal = externalObj;
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
        type: Array.isArray(Object.entries(content)[0][1]) ? 'loop' : 'simple',
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
