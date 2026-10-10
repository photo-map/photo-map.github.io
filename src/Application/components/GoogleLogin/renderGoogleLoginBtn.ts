/**
 * 渲染 Google 登录按钮。
 *
 * `auth2` 是 `gapi.auth2.init()` 返回的 GoogleAuth 实例；
 * 未安装 `@types/gapi.auth2`，参数先按 any 处理（与 src/globals.d.ts 一致）。
 */
export interface RenderGoogleLoginBtnProps {
  onLoginSuccess: (user: any) => void;
  onRenderFinish: () => void;
}

export default function renderGoogleLoginBtn(
  props: RenderGoogleLoginBtnProps,
  auth2: any
) {
  console.debug('renderGoogleLoginBtn()', props, auth2);

  /**
   * User signed in by clicking button.
   * @param {gapi.auth2.GoogleUser} user
   */
  const onSuccess = (user: any) => {
    console.debug('onSuccess()', user);
    console.debug('User signed in by clicking button.');
    props.onLoginSuccess(user);
  };
  const onFailure = (error: any) => {
    console.debug('onFailure(), error:', error);
  };
  /**
   * @param {bool} a
   */
  const signinChanged = (a: any) => {
    console.debug('signinChanged()', a);
  };
  /**
   * @param {gapi.auth2.GoogleUser} user
   */
  const userChanged = (user: any) => {
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

  // API https://developers.google.com/identity/sign-in/web/reference#googleauththenoninit
  window.gapi.load('signin2', () => {
    /* Ready. Make a call to gapi.signin2.render or some other API */
    console.debug('signin2 loaded');

    /**
     * User already signed in when rendering button.
     * Only after this success, can use Google Drive Files API to get users' files.
     * @param {gapi.auth2.GoogleUser} user
     */
    const handleSuccess = (user: any) => {
      console.debug('handleSuccess()', user);
      console.debug('User already signed in when rendering button.');
      props.onLoginSuccess(user);
    };
    const handleFailure = (a: any, b: any, c: any) => {
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