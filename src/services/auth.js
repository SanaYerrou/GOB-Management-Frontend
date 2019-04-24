const setupKeycloack = () => {
  const keycloak = window.Keycloak();

  const init = async (loginRequired = false) => {
    const options = {
      onLoad: loginRequired ? "login-required" : null,
      "check-sso": true,
      promiseType: "native" // To enable async/await
    };
    return keycloak.init(options);
  };

  const login = async () => {
    await isReady;
    const options = {
      prompt: "GOB Login" // Currently this option seems to get ignored
    };
    keycloak.login(options);
  };

  const logout = async () => {
    await isReady;
    keycloak.logout();
  };

  const userInfo = async () => {
    await isReady;
    if (keycloak.authenticated) {
      return keycloak.loadUserInfo();
    } else {
      return null;
    }
  };

  const isReady = new Promise(async (resolve, reject) => {
    // This is executed during load of this module
    // The promise is awaited in the other methods
    try {
      await init();
      resolve();
    } catch (e) {
      reject();
    }
  });

  keycloak.onReady = authenticated => {
    console.debug("Keycloak ready, authenticated", authenticated);
  };

  keycloak.onAuthSuccess = function() {
    console.debug("Auth success");
  };

  keycloak.onAuthError = function() {
    console.debug("Auth error");
  };

  keycloak.onAuthRefreshSuccess = function() {
    console.debug("Auth refresh success");
  };

  keycloak.onAuthRefreshError = function() {
    console.debug("Auth refresh error");
  };

  keycloak.onAuthLogout = function() {
    console.debug("Auth.debugout");
  };

  keycloak.onTokenExpired = function() {
    console.debug("Token expired");
  };

  return {
    login,
    userInfo,
    logout
  };
};

export default setupKeycloack();
