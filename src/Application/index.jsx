import React, { useState, useEffect } from "react";
import debugModule from "debug";

import GoogleMap from "./GoogleMap";
import { simpleMarker } from "./markers";
import AMap from "./AMap";
import "./index.css";
import MapSelector from "./MapSelector";
// import loadAlbums from "./helpers/loadAlbums";
import getPhotos from "./helpers/getPhotos";

const debug = debugModule("photo-map:src/Application/index.jsx");
const center2 = { latitude: 39.871446, longitude: 116.215768 };
const center = { lat: 39.871446, lng: 116.215768 };

// const loadPhotos = (setMediaItems) => {
//   var restRequest = window.gapi.client.request({
//     path: "https://photoslibrary.googleapis.com/v1/mediaItems",
//   });

//   restRequest.execute((resp) => {
//     console.log("photo list response:", resp);

//     setMediaItems(resp.mediaItems);

//     // resp.mediaItems.forEach((item) => {
//     //   var restRequest = window.gapi.client.request({
//     //     path: `https://photoslibrary.googleapis.com/v1/mediaItems/${item.id}`,
//     //   });

//     //   restRequest.execute((resp) => {
//     //     console.log("photo response:", resp);
//     //     props.onLoaded(resp);
//     //   });
//     // });
//   });
// };

export default function Application(props) {
  debug("render()");

  const [isMarkerShown, setIsMarkerShown] = useState(false);
  const [selectedMap, setSelectedMap] = useState("amap");
  // const [mediaItems, setMediaItems] = useState([]);
  const [files, setFiles] = useState([]);

  const delayedShowMarker = () => {
    setTimeout(() => {
      setIsMarkerShown(true);
    }, 1000);
  };

  const handleMarkerClick = () => {
    setIsMarkerShown(false);
    delayedShowMarker();
  };

  const handleLoginSuccess = () => {
    debug("handleLoginSuccess");

    /**
     * https://github.com/google/google-api-javascript-client/blob/master/samples/simpleRequest.html
     */

    const gapiLoaed = async () => {
      debug("gapi client loaded.");

      // loadPhotos(setMediaItems);
      // loadAlbums();
      const files = await getPhotos();
      setFiles(files);
    };

    window.gapi.load("client", gapiLoaed);
  };

  useEffect(() => {
    debug("useEffect()");
    delayedShowMarker();

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
        client_id:
          "769870583187-6p6tvl5nh7qc8m9hrgqh285siqm9oc37.apps.googleusercontent.com",
        scope:
          "profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/photoslibrary.readonly",
      });

      const onSuccess = () => {
        debug("onSuccess()");
      };
      const onFailure = (error) => {
        debug("onFailure(), error:", error);
      };
      const signinChanged = () => {
        debug("signinChanged()");
      };
      const userChanged = () => {
        debug("userChanged()");
      };
      auth2.attachClickHandler(
        "custom-google-login-button",
        {},
        onSuccess,
        onFailure
      );

      auth2.isSignedIn.listen(signinChanged);
      auth2.currentUser.listen(userChanged); // This is what you use to listen for user changes

      window.gapi.load("signin2", function () {
        debug("signin2 loaded");

        window.gapi.signin2.render("custom-google-login-button", {
          onsuccess: handleLoginSuccess,
        });
      });
    });
  }, []);

  const showAMap = selectedMap === "amap";

  return (
    <div className="application">
      <MapSelector onChange={(name) => setSelectedMap(name)} />
      <div className="google-login-wrapper">
        <div className="google-login-button">
          <div id="custom-google-login-button" />
        </div>
      </div>
      {showAMap ? (
        <AMap defaultCenter={center2} files={files} />
      ) : (
        <GoogleMap
          isMarkerShown={isMarkerShown}
          defaultZoom={16}
          defaultCenter={center}
          markers={[simpleMarker]}
          files={files}
          onMarkerClick={handleMarkerClick}
        />
      )}
      {/*<div>
        {mediaItems.map((item) => (
          <div key={item.id}>
            <img alt={item.id} src={item.baseUrl} />
          </div>
        ))}
        </div>*/}
    </div>
  );
}
