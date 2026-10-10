import React, { Component } from 'react';

import renderGoogleLoginBtn from './renderGoogleLoginBtn';

const scopeNeeded = [
  'profile',
  'email',
  'https://www.googleapis.com/auth/drive',
  // "https://www.googleapis.com/auth/photoslibrary.readonly",
].join(' ');

const renderLoginBtn = (): React.ReactElement | null => {
  const googleAuth = window.gapi.auth2.getAuthInstance();

  if (googleAuth && googleAuth.isSignedIn.get()) {
    // Already signed in, hide login button.
    return null;
  }

  // TODO need to call gapi to render the button again on this empty tag
  return <div id='custom-google-login-button' />;
};

interface GoogleLoginProps {
  clientId: string;
  onLoginSuccess: (user: any) => void;
  onRenderFinish: () => void;
  onSignedOut: () => void;
}

interface GoogleLoginState {
  gapiAuth2Loaded: boolean;
  signedIn: boolean;
}

/**
 * Google Login Button
 * ## References
 * - https://developers.google.com/identity/sign-in/web/build-button#customizing_the_automatically_rendered_sign-in_button_recommended
 * - https://stackoverflow.com/questions/31610461/using-google-sign-in-button-with-react
 * - https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid_options
 */
export default class GoogleLogin extends Component<
  GoogleLoginProps,
  GoogleLoginState
> {
  mounted = false;

  constructor(props: GoogleLoginProps) {
    super(props);
    this.state = {
      gapiAuth2Loaded: false,
      signedIn: false,
    };
  }

  componentDidMount() {
    const { onLoginSuccess, onRenderFinish } = this.props;

    this.mounted = true;

    const onGapiAuth2Loaded = () => {
      console.debug('[GoogleLogin] auth2 loaded');
      const { clientId } = this.props;

      if (!this.mounted) {
        // For example, this component loaded, but then page crashs, so this component is umounted
        console.warn('GoogleLogin is umounted when onGapiAuth2Loaded()!');
        return;
      }
      this.setState({ gapiAuth2Loaded: true });

      const auth2 = window.gapi.auth2.init({
        client_id: clientId,
        scope: scopeNeeded,
      });

      renderGoogleLoginBtn(
        {
          /**
           * User success signed in Google account.
           * @param {gapi.auth2.GoogleUser} user
           */
          onLoginSuccess: (user: any) => {
            if (!this.mounted) {
              console.warn('GoogleLogin is umounted when onLoginSuccess()!');
            }
            this.setState({ signedIn: true });
            onLoginSuccess(user);
          },
          onRenderFinish,
        },
        auth2
      );
    };

    // https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md#----gapiloadlibraries-callbackorconfig------
    window.gapi.load('auth2', onGapiAuth2Loaded);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleSignOutBtnClick = () => {
    const { onSignedOut } = this.props;
    // https://developers.google.com/identity/sign-in/web/reference#gapiauth2getauthinstance
    const googleAuth = window.gapi.auth2.getAuthInstance();
    googleAuth.signOut().then(() => {
      console.debug('[GoogleLogin] User signed out by clicking button.');
      this.setState({ signedIn: false });
      onSignedOut();
    });
  };

  renderSignOutBtn = (): React.ReactElement | null => {
    const { signedIn } = this.state;
    if (!signedIn) {
      return null;
    }
    return (
      <button type='button' onClick={this.handleSignOutBtnClick}>
        Sign out
      </button>
    );
  };

  render() {
    const { gapiAuth2Loaded } = this.state;
    if (!gapiAuth2Loaded) {
      return (
        <div>The &quot;auth2&quot; gapi library doesn&apos;t loaded yet.</div>
      );
    }

    return (
      <div>
        <h3>Google Login</h3>
        {renderLoginBtn()}
        {this.renderSignOutBtn()}
      </div>
    );
  }
}