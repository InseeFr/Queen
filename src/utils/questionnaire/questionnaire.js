import { MIN_LUNATIC_MODEL_VERSION, MIN_ENO_CORE_VERSION } from 'utils/constants';

const checkVersion = (actualVersion, expectedVersion) => {
  const [major, minor] = expectedVersion.split('.');
  const [majorA, minorA] = actualVersion.split('.');

  try {
    const majorInt = parseInt(major, 10);
    const minorInt = parseInt(minor, 10);
    const majorAInt = parseInt(majorA, 10);
    const minorAInt = parseInt(minorA, 10);
    if (majorInt === majorAInt && minorAInt >= minorInt) return { valid: true };
    return { valid: false };
  } catch (e) {
    return { valid: false };
  }
};

export const checkVersions = ({ enoCoreVersion, lunaticModelVersion }) => {
  const { valid: enoValid } = checkVersion(enoCoreVersion, MIN_ENO_CORE_VERSION);
  const { valid: lunaticValid } = checkVersion(lunaticModelVersion, MIN_LUNATIC_MODEL_VERSION);
  if (!enoValid || !lunaticValid) {
    const enoMessage = !enoValid
      ? `The Eno version of questionnaire is not compatible (actual : ${enoCoreVersion}, min expected : ${MIN_ENO_CORE_VERSION}).`
      : '';
    const lunaticMessage = !lunaticValid
      ? `The Lunatic-Model version of questionnaire is not compatible (actual : ${lunaticModelVersion}, min expected : ${MIN_LUNATIC_MODEL_VERSION}).`
      : '';
    return {
      valid: enoValid && lunaticValid,
      error: `${enoMessage} ${lunaticMessage}`,
    };
  }
  return { valid: true };
};
