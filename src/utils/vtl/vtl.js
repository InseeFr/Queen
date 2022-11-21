import { interpret } from '@inseefr/trevas';

const isDataSet = result => {
  return result && typeof result === 'object' && result.dataPoints;
};

const extractDataSetResult = dataSet => {
  const { dataPoints } = dataSet;
  if (dataPoints) {
    const { result } = dataPoints;
    return result;
  }
  return undefined;
};

export const executeVtlExpression = (expression, vtlBindings) => {
  const legalVtlBindings = Object.entries(vtlBindings).reduce(
    (acc, [k, v]) => ({ ...acc, [k]: getVtlCompatibleValue(v) }),
    {}
  );
  const result = interpret(expression, legalVtlBindings);
  if (isDataSet(result)) {
    return extractDataSetResult(result);
  }
  if (result === null) {
    return null;
  }
  if (typeof result === 'object') {
    return expression;
  }

  return result;
};

export const getVtlCompatibleValue = value => {
  if (value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return {
      dataStructure: { result: {} },
      dataPoints: {
        result: value,
      },
    };
  }

  return value;
};
