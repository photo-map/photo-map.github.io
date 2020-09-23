/* global gapi */
import React, { useEffect } from "react";

/**
 * ## References
 * - https://developers.google.com/identity/sign-in/web/build-button#customizing_the_automatically_rendered_sign-in_button_recommended
 * - https://stackoverflow.com/questions/31610461/using-google-sign-in-button-with-react
 * - https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid_options
 */
export default function GoogleLoginButton(props) {
  useEffect(() => {
    function onSignIn(googleUser) {
      // Useful data for your client-side scripts:
      var profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); // Don't send this directly to your server!
      console.log("Full Name: " + profile.getName());
      console.log("Given Name: " + profile.getGivenName());
      console.log("Family Name: " + profile.getFamilyName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail());

      // The ID token you need to pass to your backend:
      var id_token = googleUser.getAuthResponse().id_token;
      console.log("ID Token: " + id_token);
    }
    gapi.signin2.render("g-signin2", {
      scope: "https://www.googleapis.com/auth/plus.login",
      width: 200,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onSignIn,
    });
  }, []);

  return (
    <div className="google-login-button">
      <div id="g-signin2" />
    </div>
  );
}
