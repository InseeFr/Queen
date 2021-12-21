export const KEYCLOAK = 'keycloak';
export const ANONYMOUS = 'anonymous';
export const OIDC = 'OIDC';
export const NONE = 'NONE';
export const AUTHENTICATION_TYPE_ENUM = [NONE, OIDC];
export const AUTHENTICATION_MODE_ENUM = [ANONYMOUS, KEYCLOAK];

export const READ_ONLY = 'readonly';
export const QUEEN_URL = window.localStorage.getItem('QUEEN_URL') || '';
export const QUEEN_USER_KEY = 'QUEEN_USER';
export const SYNCHRONIZE_KEY = 'SYNCHRONIZE';

export const QUEEN_SYNC_RESULT = 'QUEEN_SYNC_RESULT';
export const GUEST_QUEEN_USER = {
  lastName: 'Guest',
  firstName: 'Guest',
  id: 'Guest',
  roles: ['Guest'],
};

export const AUTHORIZED_ROLES = ['Guest', 'offline_access'];

export const JSON_UTF8_HEADER = 'application/json;charset=utf-8';

export const DIRECT_CONTINUE_COMPONENTS = ['CheckboxOne', 'Radio'];

export const SIMPSONS = 'simpsons';
export const TIC = 'tic';
export const DEFAULT = 'default';
export const LOGEMENT = 'logement';
export const TEST = 'test';

export const QUESTIONNAIRE_EXAMPLES = [SIMPSONS, TIC, LOGEMENT, TEST];

export const QUESTIONNAIRE_EXAMPLE_URL = q =>
  `${QUEEN_URL || window.location.origin}/static/questionnaire/${q}/form.json`;
export const DATA_EXAMPLE_URL = q =>
  `${QUEEN_URL || window.location.origin}/static/questionnaire/${q}/data.json`;

export const DEFAULT_DATA_URL = DATA_EXAMPLE_URL(DEFAULT);

export const MIN_LUNATIC_MODEL_VERSION = '2.2.3';
export const MIN_ENO_CORE_VERSION = '2.2.11';

export * from './paradata';
