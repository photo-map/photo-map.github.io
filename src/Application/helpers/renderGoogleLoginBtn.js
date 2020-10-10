import debugModule from "debug";
import ReactGA from "react-ga";

import { gapiOAuthClientId } from "../config";

const debug = debugModule(
  "photo-map:src/Application/helpers/renderGoogleLoginBtn.js"
);
const scopeNeeded = [
  "profile",
  "email",
  "https://www.googleapis.com/auth/drive",
  // "https://www.googleapis.com/auth/photoslibrary.readonly",
].join(" ");

export default function renderGoogleLoginBtn(props) {
  debug("renderGoogleLoginBtn()", props);

  /**
   * Google Login Button
   * ## References
   * - https://developers.google.com/identity/sign-in/web/build-button#customizing_the_automatically_rendered_sign-in_button_recommended
   * - https://stackoverflow.com/questions/31610461/using-google-sign-in-button-with-react
   * - https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid_options
   */
  window.gapi.load("auth2", () => {
    debug("auth2 loaded");

    const auth2 = window.gapi.auth2.init({
      client_id: gapiOAuthClientId,
      scope: scopeNeeded,
    });

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
  });
}
