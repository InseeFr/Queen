export const KEYCLOAK = 'keycloak';
export const ANONYMOUS = 'anonymous';
export const AUTHENTICATION_MODE_ENUM = [ANONYMOUS, KEYCLOAK];

export const READ_ONLY = 'readonly';
export const QUEEN_URL = window.localStorage.getItem('QUEEN_URL') || '';
export const QUEEN_USER_KEY = 'queen-user';
export const GUEST_QUEEN_USER = {
  lastName: 'Guest',
  firstName: 'Guest',
  id: 'Guest',
  roles: ['Guest'],
};

export const JSON_UTF8_HEADER = 'application/json;charset=utf-8';

export const REFUSAL_LABEL = '__REFUSAL__';
export const REFUSAL = 'REFUSAL';
export const DOESNT_KNOW_LABEL = '__DOESNT_KNOW__';
export const DOESNT_KNOW = 'DOESNT_KNOW';
export const QUEEN_DATA_KEYS = [REFUSAL, DOESNT_KNOW];

export const DIRECT_CONTINUE_COMPONENTS = ['CheckboxOne', 'Radio'];

export const QUEEN_ROLES = [];

export const KEYBOARD_SHORTCUT_COMPONENTS = [...DIRECT_CONTINUE_COMPONENTS, 'CheckboxGroup'];
