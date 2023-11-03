export const environment = {
  production: false,
  keycloak: 'http://localhost:8080/realms/master',
  callback: 'http://localhost:4200/keycloak/callback',
  login: 'http://localhost:4200/keycloak/login',
  audit: 'http://localhost:9001/audit',
  core: 'http://localhost:9002/core',
  account: 'http://localhost:9003/account',
  clientId: 'wban-client',
  authFlow: 'authcode'
};
