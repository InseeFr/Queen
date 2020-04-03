import { buildQueenData, getStateToSave, updateQueenData } from './queenData';

const initialData = {
  COLLECTED: {
    VAR1: { COLLECTED: '__DOESNT_KNOW__' },
    VAR2: { COLLECTED: '__REFUSAL__' },
    VAR3: { COLLECTED: '__DOESNT_KNOW__' },
    VAR4: { COLLECTED: '__REFUSAL__' },
    VAR5: { COLLECTED: '__DOESNT_KNOW__' },
    VAR6: { COLLECTED: 'collected var' },
    VAR7: { COLLECTED: true },
  },
  EXTERNAL: {
    VAR8: '12/07/1998',
  },
};

const dataExpected = {
  queenData: {
    DOESNT_KNOW: ['VAR1', 'VAR3', 'VAR5'],
    REFUSAL: ['VAR2', 'VAR4'],
  },
  data: {
    COLLECTED: {
      VAR1: { COLLECTED: null },
      VAR2: { COLLECTED: null },
      VAR3: { COLLECTED: null },
      VAR4: { COLLECTED: null },
      VAR5: { COLLECTED: null },
      VAR6: { COLLECTED: 'collected var' },
      VAR7: { COLLECTED: true },
    },
    EXTERNAL: {
      VAR8: '12/07/1998',
    },
  },
};

const currentComponent = {
  componentType: 'Input',
  response: {
    name: 'VAR1',
    valueState: [{ valueType: 'COLLECTED', value: null }],
  },
};

const currentComponentCheckboxBoolean = {
  componentType: 'CheckboxBoolean',
  response: {
    name: 'VAR2',
    valueState: [{ valueType: 'COLLECTED', value: null }],
  },
};

const questionnaire = { components: [currentComponent, currentComponentCheckboxBoolean] };
const queenData = { DOESNT_KNOW: ['VAR2'], REFUSAL: ['VAR1'] };
const expectedStateToSave = {
  COLLECTED: {
    VAR1: { COLLECTED: '__REFUSAL__' },
    VAR2: { COLLECTED: '__DOESNT_KNOW__' },
  },
};

describe('getStateToSave utils', () => {
  describe('getStateToSave', () => {
    it('should return data {data,queenData} ', () => {
      const stateToSave = getStateToSave(questionnaire)(queenData);
      expect(stateToSave.COLLECTED['VAR1'].COLLECTED).toBe(
        expectedStateToSave.COLLECTED['VAR1'].COLLECTED
      );
      expect(stateToSave.COLLECTED['VAR2'].COLLECTED).toBe(
        expectedStateToSave.COLLECTED['VAR2'].COLLECTED
      );
    });
  });
});

describe('updateQueenData utils', () => {
  describe('updateQueenData', () => {
    it('should return data {data,queenData} ', () => {
      const queenData = { DOESNT_KNOW: [], REFUSAL: [] };
      const transformedQueenData1 = updateQueenData(queenData)(currentComponent);
      expect(transformedQueenData1.DOESNT_KNOW.includes('VAR1')).toBe(true);
      const transformedQueenData2 = updateQueenData(queenData)(currentComponentCheckboxBoolean);
      expect(transformedQueenData2.DOESNT_KNOW.includes('VAR1')).toBe(false);
    });
  });
});

describe('queenData utils', () => {
  describe('buildQueenData', () => {
    it('should return data {data,queenData} ', () => {
      const transformedData = buildQueenData(initialData);
      dataExpected.queenData.REFUSAL.forEach(name => {
        expect(transformedData.queenData.DOESNT_KNOW.includes(name)).toBe(false);
        expect(transformedData.queenData.REFUSAL.includes(name)).toBe(true);
      });
      dataExpected.queenData.DOESNT_KNOW.forEach(name => {
        expect(transformedData.queenData.DOESNT_KNOW.includes(name)).toBe(true);
        expect(transformedData.queenData.REFUSAL.includes(name)).toBe(false);
      });
      expect(transformedData.data.COLLECTED['VAR1'].COLLECTED).toBe(
        dataExpected.data.COLLECTED['VAR1'].COLLECTED
      );
      expect(transformedData.data.COLLECTED['VAR2'].COLLECTED).toBe(
        dataExpected.data.COLLECTED['VAR2'].COLLECTED
      );
      expect(transformedData.data.COLLECTED['VAR6'].COLLECTED).toBe(
        dataExpected.data.COLLECTED['VAR6'].COLLECTED
      );
    });
  });
});
