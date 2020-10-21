import { AUTHENTICATION_MODE_ENUM } from 'utils/constants';
import { initialize as init } from './initialize';

export const initialize = params => {
  const { configuration } = params;
  const { QUEEN_AUTHENTICATION_MODE } = configuration;
  let initializeFunction;
  if (AUTHENTICATION_MODE_ENUM.includes(QUEEN_AUTHENTICATION_MODE)) {
    initializeFunction = init(params);
  } else {
    initializeFunction = () =>
      new Promise((resolve, reject) =>
        reject(
          new Error(
            `The current authentication mode is ${QUEEN_AUTHENTICATION_MODE}. Expected one of "${AUTHENTICATION_MODE_ENUM[0]}" or "${AUTHENTICATION_MODE_ENUM[1]}".`
          )
        )
      );
  }
  return initializeFunction;
};
