export default function renderGoogleLoginBtn(props, auth2) {
  console.debug('renderGoogleLoginBtn()', props, auth2);

  /**
   * User signed in by clicking button.
   * @param {gapi.auth2.GoogleUser} user
   */
  const onSuccess = (user) => {
    console.debug('onSuccess()', user);
    console.debug('User signed in by clicking button.');
    props.onLoginSuccess(user);
  };
  const onFailure = (error) => {
    console.debug('onFailure(), error:', error);
  };
  /**
   * @param {bool} a
   */
  const signinChanged = (a) => {
    console.debug('signinChanged()', a);
  };
  /**
   * @param {gapi.auth2.GoogleUser} user
   */
  const userChanged = (user) => {
    console.debug('userChanged()', user);
  };
  auth2.attachClickHandler(
    'custom-google-login-button',
    {},
    onSuccess,
    onFailure
  );

  auth2.isSignedIn.listen(signinChanged);
  // API: https://developers.google.com/identity/sign-in/web/reference#googleauthcurrentuserlistenlistener
  auth2.currentUser.listen(userChanged); // This is what you use to listen for user changes

  window.gapi.load('signin2', () => {
    console.debug('signin2 loaded');

    /**
     * User already signed in when rendering button.
     * @param {gapi.auth2.GoogleUser} user
     */
    const handleSuccess = (user) => {
      console.debug('handleSuccess()', user);
      console.debug('User already signed in when rendering button.');
      props.onLoginSuccess(user);
    };
    const handleFailure = (a, b, c) => {
      console.debug('handleFailure', a, b, c);
    };

    // API https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid_options
    window.gapi.signin2.render('custom-google-login-button', {
      onsuccess: handleSuccess,
      onfailure: handleFailure,
    });

    props.onRenderFinish();
  });
}
