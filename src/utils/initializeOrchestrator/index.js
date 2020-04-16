import { AUTHENTICATION_MODE_ENUM } from 'utils/constants';
import { initialize as init } from './initialize';

export const initialize = (
  configuration,
  idQuestionnaire,
  idSurveyUnit,
  setWaitingMessage,
  setQuestionnaire,
  setSurveyUnit
) => {
  const params = {
    configuration,
    idQuestionnaire,
    idSurveyUnit,
    setWaitingMessage,
    setQuestionnaire,
    setSurveyUnit,
  };
  const { authenticationMode } = configuration;
  let initializeFunction;
  if (AUTHENTICATION_MODE_ENUM.includes(authenticationMode)) {
    initializeFunction = init(params);
  } else {
    initializeFunction = () =>
      new Promise((resolve, reject) =>
        reject(
          new Error(
            `The current authentication mode is ${authenticationMode}. Expected one of "${KEYCLOAK}" or "${ANONYMOUS}".`
          )
        )
      );
  }
  return initializeFunction;
};
