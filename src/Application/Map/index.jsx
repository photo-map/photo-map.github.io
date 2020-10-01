import React, { Component } from "react";
import { Drawer, Button } from "antd";
import ReactGA from "react-ga";
import debugModule from "debug";

import GoogleMap from "./GoogleMap";
import { simpleMarker } from "./markers";
import AMap from "./AMap";
import MapSelector from "./MapSelector";
import Warning from "../Warning";

import getPhotos from "../helpers/getPhotos";
import renderGoogleLoginBtn from "../helpers/renderGoogleLoginBtn";

const debug = debugModule("photo-map:src/Application/Map/index.jsx");
const amapCenter = { latitude: 39.871446, longitude: 116.215768 };
const googleMapCenter = { lat: 39.871446, lng: 116.215768 };

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gapiLoaded: false, // Google API loaded or not
      isMarkerShown: false,
      selectedMap: "amap",
      files: [],
      amapLoaded: false,
      drawerVisible: false,
    };

    this.aMapRef = React.createRef();
    this.aMapMarkers = [];

    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleMapInstanceCreated = this.handleMapInstanceCreated.bind(this);
  }

  componentDidMount() {
    debug("componentDidMount()");
    this.delayedShowMarker();

    // window.gapiLoadedFlag is defined in public/index.html
    // This flag is true only when Google API's platform.js is loaded, .
    if (window.gapiLoadedFlag) {
      this.setState({
        gapiLoaded: true,
      });
      renderGoogleLoginBtn(this.handleLoginSuccess);
    }
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

  /**
   * User success signed in Google account.
   * @param {gapi.auth2.GoogleUser} user
   */
  handleLoginSuccess(user) {
    debug("handleLoginSuccess", user);

    /**
     * https://github.com/google/google-api-javascript-client/blob/master/samples/simpleRequest.html
     */

    const gapiLoaed = async () => {
      debug("gapi client loaded.");

      const files = await getPhotos();

      this.setState({
        files,
      });

      this.aMapRef.current.addMarkers(files);
    };

    window.gapi.load("client", gapiLoaed);
  }

  handleMapInstanceCreated() {
    debug("handleMapInstanceCreated()", window.AMap);
    this.setState({ amapLoaded: true });
  }

  handleSignOutBtnClick = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log("User signed out by clicking button.");
      this.setState({
        files: [],
      });
      this.aMapRef.current.removeMarkers();
    });
    ReactGA.event({
      category: "Auth",
      action: "User logout",
    });
  };

  handleDrawerOpen = () => {
    this.setState({ drawerVisible: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerVisible: false });
  };

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({
        isMarkerShown: true,
      });
    }, 1000);
  };

  render() {
    debug("render()", window.gapiLoaded);

    const {
      gapiLoaded,
      isMarkerShown,
      selectedMap,
      files,
      drawerVisible,
    } = this.state;

    if (!gapiLoaded) {
      return <Warning />;
    }

    const showAMap = selectedMap === "amap";

    return (
      <div className="map-wrapper">
        {showAMap ? (
          <AMap
            ref={this.aMapRef}
            defaultCenter={amapCenter}
            defaultZoom={16}
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

        <div className="menu-btn-wrapper">
          <Button onClick={this.handleDrawerOpen}>Menu</Button>
        </div>
        <Drawer
          className="menu-drawer"
          placement="right"
          closable={false}
          forceRender
          visible={drawerVisible}
          onClose={this.handleDrawerClose}
        >
          <MapSelector onChange={this.handleMapChange} />
          <div>
            <div id="custom-google-login-button" />
            <button onClick={this.handleSignOutBtnClick}>Sign out</button>
            <ReactGA.OutboundLink
              eventLabel="HowToUse"
              to="https://github.com/photo-map/photo-map.github.io/blob/master/help/HOW_TO_USE.md#how-to-use"
              target="_blank"
            >
              How to use
            </ReactGA.OutboundLink>
          </div>
        </Drawer>
      </div>
    );
  }
}
