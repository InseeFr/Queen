import {
  COMP_TYPE_CHECK_BOX_BOOLEAN,
  COMP_TYPE_CHECK_BOX_GROUP,
  COMP_TYPE_INPUT_NUMBER,
  COMP_TYPE_LOOP,
  COMP_TYPE_SEQUENCE,
  COMP_TYPE_SUBSEQUENCE,
  COMP_TYPE_TABLE,
  COMP_TYPE_TEXTAREA,
} from 'utils/constants';

export const componentHasResponse = component => {
  if (component === undefined) return false;

  // check for missingResponse
  if (![undefined, null, {}].includes(component?.missingResponse?.value)) return true;

  const { componentType } = component;
  switch (componentType) {
    case COMP_TYPE_CHECK_BOX_GROUP:
    case COMP_TYPE_TABLE:
      return Object.values(component.value).some(val => val !== null);
    case COMP_TYPE_INPUT_NUMBER:
    case COMP_TYPE_CHECK_BOX_BOOLEAN:
    case COMP_TYPE_TEXTAREA:
      return component.value !== null;
    case COMP_TYPE_LOOP:
    case COMP_TYPE_SUBSEQUENCE:
    case COMP_TYPE_SEQUENCE:
      return true;
    default:
      return !!component.value;
  }
};
