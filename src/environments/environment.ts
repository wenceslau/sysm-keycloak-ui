export const environment = {
  production: true,
  keycloak: 'http://keycloak:18080/realms/master',
  callback: 'http://localhost:8888/ui/keycloak/callback',
  login: 'http://localhost:8888/ui/keycloak/login',
  core: 'http://kong:8000/core',
  audit: 'http://kong:8000/audit',
  account: 'http://kong:8000/account'
};
