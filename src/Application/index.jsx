import React, { Component } from "react";
import debugModule from "debug";

import GoogleMap from "./GoogleMap";
import { simpleMarker } from "./markers";
import AMap from "./AMap";
import "./index.css";
import MapSelector from "./MapSelector";
import getPhotos from "./helpers/getPhotos";

const debug = debugModule("photo-map:src/Application/index.jsx");
const amapCenter = { latitude: 39.871446, longitude: 116.215768 };
const googleMapCenter = { lat: 39.871446, lng: 116.215768 };

export default class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: false,
      selectedMap: "amap",
      files: [],
      amapLoaded: false,
      // photos=[{ location: {latitude:1,longitude:103}, thumbnail: '....' }]
      photos: [],
    };
    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleMapInstanceCreated = this.handleMapInstanceCreated.bind(this);
    this.loginGoogle = this.loginGoogle.bind(this);
  }

  componentDidMount() {
    debug("useEffect()");
    this.delayedShowMarker();

    this.loginGoogle();
  }

  handleMapChange(name) {
    this.setState({
      selectedMap: name,
    });
  }

  handleMarkerClick() {
    this.setState({
      isMarkerShown: false,
    });
    this.delayedShowMarker();
  }

  handleLoginSuccess() {
    debug("handleLoginSuccess");

    /**
     * https://github.com/google/google-api-javascript-client/blob/master/samples/simpleRequest.html
     */

    const gapiLoaed = async () => {
      debug("gapi client loaded.");

      const files = await getPhotos();

      this.setState({
        files,
      });

      this.convertAllLocations(files);
    };

    window.gapi.load("client", gapiLoaed);
  }

  handleMapInstanceCreated() {
    debug("handleMapInstanceCreated()", window.AMap);
    this.setState({ amapLoaded: true });
  }

  handleSignOutBtnClick = () => {
    var auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log("User signed out.");
    });
  };

  loginGoogle() {
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

      window.gapi.load("signin2", () => {
        debug("signin2 loaded");

        window.gapi.signin2.render("custom-google-login-button", {
          onsuccess: this.handleLoginSuccess,
        });
      });
    });
  }

  updateItem = (index) => (photo) => {
    debug("updateItem()");

    this.setState((prevState) => {
      return {
        photos: [...prevState.photos, photo],
      };
    });
  };

  // Convert all photo locations from GPS to AMap
  convertAllLocations = (files) => {
    if (!window.AMap) {
      alert(
        "We are about to convert location from GPS to AMap, but AMap still not loaded!"
      );
      return;
    }

    files.forEach((file, index) => {
      debug("props.files.forEach", file, index);
      // lnglat = [116.46706996,39.99188446]
      const lnglat = [
        file.imageMediaMetadata.location.longitude,
        file.imageMediaMetadata.location.latitude,
      ];

      debug("window.AMap.convertFrom() loading");
      window.AMap.convertFrom(lnglat, "gps", (status, result) => {
        debug("window.AMap.convertFrom", status, result);

        if (result.info === "ok") {
          var resLnglat = result.locations[0];
          // resLnglat={Q: 39.877753363716
          // R: 116.21148084852501
          // lat: 39.877753
          // lng: 116.211481}
          this.updateItem(index)({
            position: {
              latitude: resLnglat.lat,
              longitude: resLnglat.lng,
            },
            thumbnail: file.thumbnailLink,
          });
        }
      });
    });
  };

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({
        isMarkerShown: true,
      });
    }, 1000);
  };

  render() {
    debug("render()");

    const { isMarkerShown, selectedMap, files, photos } = this.state;

    const showAMap = selectedMap === "amap";

    return (
      <div className="application">
        <MapSelector onChange={this.handleMapChange} />
        <div className="google-login-wrapper">
          <div id="custom-google-login-button" />
          <button onClick={this.handleSignOutBtnClick}>Sign out</button>
        </div>

        {showAMap ? (
          <AMap
            defaultCenter={amapCenter}
            photos={photos}
            onMapInstanceCreated={this.handleMapInstanceCreated}
          />
        ) : (
          <GoogleMap
            isMarkerShown={isMarkerShown}
            defaultZoom={16}
            defaultCenter={googleMapCenter}
            markers={[simpleMarker]}
            files={files}
            onMarkerClick={this.handleMarkerClick}
          />
        )}
      </div>
    );
  }
}
