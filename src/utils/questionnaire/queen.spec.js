import { getResponsesLinkWith, getResponsesNameFromComponent } from './queen';

const inputComponent = {
  componentType: 'Input',
  conditionFilter: 'if(TEST) then "normal" else "hidden"',
  response: {
    name: 'VAR1',
  },
};

const checkboxBooleanComponent = {
  componentType: 'CheckboxBoolean',
  conditionFilter: 'if(TEST2) then "normal" else "hidden"',
  response: {
    name: 'VAR2',
  },
};

const checkboxGroupComponent = {
  id: 'j334akov',
  componentType: 'CheckboxGroup',
  responses: [
    {
      response: {
        name: 'VAR_1',
      },
    },
    {
      response: {
        name: 'VAR_2',
      },
    },
    {
      response: {
        name: 'VAR_3',
      },
    },
    {
      response: {
        name: 'VAR_4',
      },
    },
  ],
};

const components = [inputComponent, checkboxBooleanComponent];

describe('getResponsesLinkWith utils', () => {
  describe('getResponsesLinkWith', () => {
    it("should return ['VAR1'] ", () => {
      const responses = getResponsesLinkWith(components)('TEST');
      expect(responses.includes('VAR1')).toBe(true);
      expect(responses.includes('VAR2')).toBe(false);
    });
  });
});

describe('getResponsesNameFromComponent utils', () => {
  describe('getResponsesNameFromComponent', () => {
    it("should return ['VAR1'] ", () => {
      const responses = getResponsesNameFromComponent(inputComponent);
      expect(JSON.stringify(responses)).toBe(JSON.stringify(['VAR1']));
    });
    it("should return ['VAR_1','VAR_2','VAR_3','VAR_4'] ", () => {
      const responses = getResponsesNameFromComponent(checkboxGroupComponent);
      expect(JSON.stringify(responses)).toBe(JSON.stringify(['VAR_1', 'VAR_2', 'VAR_3', 'VAR_4']));
    });
  });
});
