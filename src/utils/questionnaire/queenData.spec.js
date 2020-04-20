import { buildQueenData, buildData } from './queenData';

const data = {
  COLLECTED: {
    variable1: {
      PREVIOUS: 'Previous',
      COLLECTED: 'Collected',
      FORCED: 'Forced',
      EDITED: 'Edited',
      INPUTED: 'Inputed',
    },
    variable2: {
      COLLECTED: 'Var 2',
    },
  },
  EXTERNAL: {
    ext: 'External var',
  },
};

const queenData = {
  COLLECTED: [
    {
      name: 'variable1',
      PREVIOUS: 'Previous',
      COLLECTED: 'Collected',
      FORCED: 'Forced',
      EDITED: 'Edited',
      INPUTED: 'Inputed',
    },
    {
      name: 'variable2',
      COLLECTED: 'Var 2',
    },
  ],
  EXTERNAL: [
    {
      name: 'ext',
      value: 'External var',
    },
  ],
};

describe('buildQueenData utils', () => {
  describe('buildQueenData', () => {
    it('should transform data to queenData', () => {
      const builtQueenData = buildQueenData(data);
      expect(builtQueenData).toStrictEqual(queenData);
    });
  });
});

describe('buildData utils', () => {
  describe('buildData', () => {
    it('should transform queenData to data', () => {
      const builtData = buildData(queenData);
      expect(builtData).toStrictEqual(data);
    });
  });
});

describe('Test invariant ', () => {
  describe('buildData(buildQueenData(data))', () => {
    it('The sequence of functions must leave the parameter invariant.', () => {
      const builtData = buildData(buildQueenData(data));
      expect(builtData).toStrictEqual(data);
      const builtQueenData = buildQueenData(buildData(queenData));
      expect(builtQueenData).toStrictEqual(queenData);
    });
  });
});
