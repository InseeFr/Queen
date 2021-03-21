export const buildOidcConfiguration = ({ oidcConf }) => {
  const { origin } = window.location;
  if (Object.values(oidcConf).filter(v => `${v}`.match(/\$\{\w+\}/)).length > 0)
    throw new Error(`Oidc file contains \${VAR} string.`);
  return {
    ...oidcConf,
    redirect_uri: `${origin}/authentication/callback`,
    post_logout_redirect_uri: `${origin}/`,
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
