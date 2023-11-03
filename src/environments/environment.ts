export const environment = {
  production: true,
  keycloak: 'http://keycloak:18080/realms/master',
  callback: 'http://localhost:8888/keycloak/callback',
  login: 'http://localhost:8888/keycloak/login',
  audit: 'http://localhost:8000/audit',
  core: 'http://localhost:8000/core',
  account: 'http://localhost:8000/account',
  clientId: 'sysm-client',
  authFlow: 'authcode'
};
