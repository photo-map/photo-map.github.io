import ReactGA from "react-ga";
import debugModule from "debug";

const debug = debugModule(
  "photo-map:src/Application/helpers/renderGoogleLoginBtn.js"
);

export default function renderGoogleLoginBtn(props, auth2) {
  debug("renderGoogleLoginBtn()", props, auth2);

  /**
   * User signed in by clicking button.
   * @param {gapi.auth2.GoogleUser} user
   */
  const onSuccess = (user) => {
    debug("onSuccess()", user);
    debug("User signed in by clicking button.");
    ReactGA.event({
      category: "Auth",
      action: "User login",
    });
    props.onLoginSuccess(user);
  };
  const onFailure = (error) => {
    debug("onFailure(), error:", error);
  };
  /**
   * @param {bool} a
   */
  const signinChanged = (a) => {
    debug("signinChanged()", a);
  };
  /**
   * @param {gapi.auth2.GoogleUser} user
   */
  const userChanged = (user) => {
    debug("userChanged()", user);
  };
  auth2.attachClickHandler(
    "custom-google-login-button",
    {},
    onSuccess,
    onFailure
  );

  auth2.isSignedIn.listen(signinChanged);
  // API: https://developers.google.com/identity/sign-in/web/reference#googleauthcurrentuserlistenlistener
  auth2.currentUser.listen(userChanged); // This is what you use to listen for user changes

  window.gapi.load("signin2", () => {
    debug("signin2 loaded");

    /**
     * User already signed in when rendering button.
     * @param {gapi.auth2.GoogleUser} user
     */
    const handleSuccess = (user) => {
      debug("handleSuccess()", user);
      debug("User already signed in when rendering button.");
      props.onLoginSuccess(user);
    };
    const handleFailure = (a, b, c) => {
      debug("handleFailure", a, b, c);
    };

    // API https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid_options
    window.gapi.signin2.render("custom-google-login-button", {
      onsuccess: handleSuccess,
      onfailure: handleFailure,
    });

    props.onRenderFinish();
  });
}
