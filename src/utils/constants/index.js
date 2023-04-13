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

export const COMP_TYPE_CHECK_BOX_BOOLEAN = 'CheckboxBoolean';
export const COMP_TYPE_CHECK_BOX_ONE = 'CheckboxOne';
export const COMP_TYPE_CHECK_BOX_GROUP = 'CheckboxGroup';
export const COMP_TYPE_TABLE = 'Table';
export const COMP_TYPE_LOOP = 'Loop';
export const COMP_TYPE_RADIO = 'Radio';
export const COMP_TYPE_INPUT_NUMBER = 'InputNumber';
export const COMP_TYPE_SUBSEQUENCE = 'Subsequence';
export const COMP_TYPE_SEQUENCE = 'Sequence';
export const COMP_TYPE_TEXTAREA = 'Textarea';
export const DIRECT_CONTINUE_COMPONENTS = [COMP_TYPE_CHECK_BOX_ONE, COMP_TYPE_RADIO];

export const SIMPSONS = 'simpsons';
export const TIC = 'tic';
export const DEFAULT = 'default';
export const LOGEMENT = 'logement';
export const LUNATICV2 = 'lunaticv2';
export const TEST = 'test';
export const SUGG = 'sug';

export const QUESTIONNAIRE_EXAMPLES = [SIMPSONS, TIC, LOGEMENT, TEST, LUNATICV2, SUGG];

export const QUESTIONNAIRE_EXAMPLE_URL = q =>
  `${QUEEN_URL || window.location.origin}/static/questionnaire/${q}/form.json`;
export const DATA_EXAMPLE_URL = q =>
  `${QUEEN_URL || window.location.origin}/static/questionnaire/${q}/data.json`;

export const NOMENCLATURE_EXAMPLE_URL = q => {
  if (q === SUGG)
    return JSON.stringify({
      'cog-communes': `${window.location.origin}/static/nomenclature/communes-2019.json`,
    });
  return JSON.stringify({});
};
export const DEFAULT_DATA_URL = DATA_EXAMPLE_URL(DEFAULT);
export const DEFAULT_NOMENCLATURE_URL = NOMENCLATURE_EXAMPLE_URL(DEFAULT);

export const MIN_LUNATIC_MODEL_VERSION = '2.2.3';
export const MIN_ENO_CORE_VERSION = '2.2.11';
export const SHORTCUT_QUIT = 'alt+q';
export const SHORTCUT_NEXT = 'alt+enter';
export const SHORTCUT_PREVIOUS = 'alt+backspace';
export const SHORTCUT_FAST_FORWARD = 'alt+end';

export * from './paradata';
