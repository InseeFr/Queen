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
      COLLECTED: ['Var 2'],
    },
    variable3: {
      PREVIOUS: [null],
      COLLECTED: [null],
      FORCED: [null],
      EDITED: [null],
      INPUTED: [null],
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
      type: 'simple',
      PREVIOUS: 'Previous',
      COLLECTED: 'Collected',
      FORCED: 'Forced',
      EDITED: 'Edited',
      INPUTED: 'Inputed',
    },
    {
      name: 'variable2',
      type: 'loop',
      COLLECTED: ['Var 2'],
    },
    {
      name: 'variable3',
      type: 'loop',
      PREVIOUS: [null],
      COLLECTED: [null],
      FORCED: [null],
      EDITED: [null],
      INPUTED: [null],
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
      expect(queenData).toStrictEqual(builtQueenData);
    });
  });
});

describe('buildData utils', () => {
  describe('buildData', () => {
    it('should transform queenData to data', () => {
      const builtData = buildData(queenData);
      expect(data).toStrictEqual(builtData);
    });
  });
});

describe('Test invariant ', () => {
  describe('buildData(buildQueenData(data))', () => {
    it('The sequence of functions must leave the parameter invariant.', () => {
      const builtData = buildData(buildQueenData(data));
      expect(data).toStrictEqual(builtData);
      const builtQueenData = buildQueenData(buildData(queenData));
      expect(queenData).toStrictEqual(builtQueenData);
    });
  });
});
