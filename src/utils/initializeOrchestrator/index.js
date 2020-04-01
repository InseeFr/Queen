import { ANONYMOUS, KEYCLOAK } from 'utils/constants';
import { initialize as initializeAnonymous } from './anonymous';
import { initialize as initializeAuthenticated } from './authentication';

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
  let initializeStrategy;
  switch (authenticationMode) {
    case ANONYMOUS:
      initializeStrategy = initializeAnonymous(params);
      break;
    case KEYCLOAK:
      initializeStrategy = initializeAuthenticated(params);
      break;
    default:
      initializeStrategy = () =>
        new Promise((resolve, reject) =>
          reject(
            new Error(
              `The current authentication mode is ${authenticationMode}. Expected one of "${KEYCLOAK}" or "${ANONYMOUS}".`
            )
          )
        );
      break;
  }
  return initializeStrategy;
};
