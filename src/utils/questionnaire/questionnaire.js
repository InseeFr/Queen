import { LUNATIC_MODEL_VERSION, ENO_CORE_VERSION } from 'utils/constants';

export const checkVersions = ({ enoCoreVersion, lunaticModelVersion }) => {
  if (
    !enoCoreVersion.startsWith(ENO_CORE_VERSION) ||
    !lunaticModelVersion.startsWith(LUNATIC_MODEL_VERSION)
  ) {
    const enoMessage = !enoCoreVersion.startsWith(ENO_CORE_VERSION)
      ? `The Eno version of questionnaire is not compatible (actual : ${enoCoreVersion}, expected : ${ENO_CORE_VERSION}).`
      : '';
    const lunaticMessage = !lunaticModelVersion.startsWith(LUNATIC_MODEL_VERSION)
      ? `The Lunatic-Model version of questionnaire is not compatible (actual : ${lunaticModelVersion}, expected : ${LUNATIC_MODEL_VERSION}).`
      : '';
    return {
      valid: false,
      error: `${enoMessage} ${lunaticMessage}`,
    };
  }
  return { valid: true };
};
