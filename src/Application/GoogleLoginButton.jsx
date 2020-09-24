import React, { useEffect } from "react";

/**
 * ## References
 * - https://developers.google.com/identity/sign-in/web/build-button#customizing_the_automatically_rendered_sign-in_button_recommended
 * - https://stackoverflow.com/questions/31610461/using-google-sign-in-button-with-react
 * - https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid_options
 */
export default function GoogleLoginButton(props) {
  useEffect(() => {
    window.gapi.load("auth2", () => {
      console.log("auth2 loaded");

      /*const auth2 =*/ window.gapi.auth2.init({
        client_id:
          "769870583187-6p6tvl5nh7qc8m9hrgqh285siqm9oc37.apps.googleusercontent.com",
        scope:
          "profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/photoslibrary.readonly",
      });

      window.gapi.load("signin2", function () {
        console.log("signin2 loaded");

        window.gapi.signin2.render("custom-google-login-button", {
          onsuccess: () => {
            console.log("login success");

            /**
             * https://github.com/google/google-api-javascript-client/blob/master/samples/simpleRequest.html
             */

            const gapiLoaed = () => {
              console.log("gapi client loaded.");

              var restRequest = window.gapi.client.request({
                path: "https://photoslibrary.googleapis.com/v1/albums",
              });

              restRequest.execute((resp) => {
                console.log("photo albums list response:", resp);
              });
            };

            window.gapi.load("client", gapiLoaed);
          },
        });
      });
    });
  }, []);

  return (
    <div className="google-login-button">
      <div id="custom-google-login-button" />
    </div>
  );
}
