import React, { Component } from "react";

import renderGoogleLoginBtn from "./renderGoogleLoginBtn";

const scopeNeeded = [
  "profile",
  "email",
  "https://www.googleapis.com/auth/drive",
  // "https://www.googleapis.com/auth/photoslibrary.readonly",
].join(" ");

/**
 * Google Login Button
 * ## References
 * - https://developers.google.com/identity/sign-in/web/build-button#customizing_the_automatically_rendered_sign-in_button_recommended
 * - https://stackoverflow.com/questions/31610461/using-google-sign-in-button-with-react
 * - https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid_options
 */
export default class GoogleLogin extends Component {
  state = {
    gapiAuth2Loaded: false,
    signedIn: false,
  };

  componentDidMount() {
    this.mounted = true;

    const onGapiAuth2Loaded = () => {
      console.debug("[GoogleLogin] auth2 loaded");

      if (!this.mounted) {
        // For example, this component loaded, but then page crashs, so this component is umounted
        console.warn("GoogleLogin is umounted when onGapiAuth2Loaded()!");
        return;
      }
      this.setState({ gapiAuth2Loaded: true });

      const auth2 = window.gapi.auth2.init({
        client_id: this.props.clientId,
        scope: scopeNeeded,
      });

      renderGoogleLoginBtn(
        {
          /**
           * User success signed in Google account.
           * @param {gapi.auth2.GoogleUser} user
           */
          onLoginSuccess: (user) => {
            if (!this.mounted) {
              console.warn("GoogleLogin is umounted when onLoginSuccess()!");
            }
            this.setState({ signedIn: true });
            this.props.onLoginSuccess(user);
          },
          onRenderFinish: this.props.onRenderFinish,
        },
        auth2
      );
    };

    // https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md#----gapiloadlibraries-callbackorconfig------
    window.gapi.load("auth2", onGapiAuth2Loaded);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleSignOutBtnClick = () => {
    // https://developers.google.com/identity/sign-in/web/reference#gapiauth2getauthinstance
    const googleAuth = window.gapi.auth2.getAuthInstance();
    googleAuth.signOut().then(() => {
      console.debug("[GoogleLogin] User signed out by clicking button.");
      this.setState({ signedIn: false });
      this.props.onSignedOut();
    });
  };

  renderLoginBtn = () => {
    const googleAuth = window.gapi.auth2.getAuthInstance();

    if (googleAuth && googleAuth.isSignedIn.get()) {
      // Already signed in, hide login button.
      return null;
    }

    // TODO need to call gapi to render the button again on this empty tag
    return <div id="custom-google-login-button" />;
  };

  renderSignOutBtn = () => {
    if (!this.state.signedIn) {
      return null;
    }
    return <button onClick={this.handleSignOutBtnClick}>Sign out</button>;
  };

  render() {
    if (!this.state.gapiAuth2Loaded) {
      return <div>The "auth2" gapi library doesn't loaded yet.</div>;
    }

    return (
      <div>
        <h3>Google Login</h3>
        {this.renderLoginBtn()}
        {this.renderSignOutBtn()}
      </div>
    );
  }
}
