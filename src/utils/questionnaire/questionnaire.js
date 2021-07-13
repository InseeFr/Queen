import { MIN_LUNATIC_MODEL_VERSION, MIN_ENO_CORE_VERSION } from 'utils/constants';

const checkVersion = (actualVersion, expectedVersion) => {
  try {
    // split by "-" to prevent versions like "x.y.z-rc" or "x.y.z-feature"
    const [major, minor, patch] = expectedVersion
      .split('.')
      .map(v => parseInt(v.split('-')[0], 10));
    const [majorA, minorA, patchA] = actualVersion
      .split('.')
      .map(v => parseInt(v.split('-')[0], 10));
    if (major === majorA && ((minorA === minor && patchA >= patch) || minorA > minor))
      return { valid: true };
    return { valid: false };
  } catch (e) {
    return { valid: false };
  }
};

const checkVersions = ({ enoCoreVersion, lunaticModelVersion }) => {
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

export const checkQuestionnaire = ({
  enoCoreVersion,
  lunaticModelVersion,
  pagination,
  missingResponse,
}) => {
  const { valid, error } = checkVersions({ enoCoreVersion, lunaticModelVersion });
  const paginationValid = pagination === 'question';
  const missingResponseValid = missingResponse || true; //remove "|| true" when Eno is ready (2.2.10)
  const paginationError = paginationValid ? '' : `Pagination must be "question".`;
  const missingResponseError = missingResponseValid ? '' : `Missing response must be true`;
  if (!(valid && paginationValid && missingResponseValid)) {
    return {
      valid: false,
      error: `Questionnaire is invalid : ${error || ''} ${paginationError} ${missingResponseError}`,
    };
  }
  return { valid: true };
};
