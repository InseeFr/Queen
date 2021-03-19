const LAST_SURVEY = 'last-survey';

const getCurrentSurvey = path => {
  if (!path.startsWith('/authentication')) {
    const temp = path.split('/questionnaire/');
    if (temp.length > 1) {
      const survey = temp[1].slice(0, temp[1].indexOf('/'));
      window.localStorage.setItem(LAST_SURVEY, survey);
      return survey;
    }
    return '';
  }
  return window.localStorage.getItem(LAST_SURVEY) || '';
};

export const buildOidcConfiguration = ({ oidcConf, conf }) => {
  const { origin, pathname } = window.location;
  const { portail } = conf;
  return {
    ...oidcConf,
    redirect_uri: `${origin}/authentication/callback`,
    post_logout_redirect_uri: `${portail}/${getCurrentSurvey(pathname)}`,
    silent_redirect_uri: `${origin}/authentication/silent_callback`,
  };
};

export const buildOidcConfigurationFromKeycloak = ({ keycloakConf }) => {
  const { origin } = window.location;
  const { realm, 'auth-server-url': authServer, resource } = keycloakConf;
  return {
    authority: `${authServer}/realms/${realm}`,
    client_id: resource,
    redirect_uri: `${origin}/authentication/callback`,
    response_type: 'code',
    post_logout_redirect_uri: `${origin}/`,
    scope: 'openid profile email',
    silent_redirect_uri: `${origin}/authentication/silent_callback`,
    automaticSilentRenew: true,
    loadUserInfo: true,
  };
};
