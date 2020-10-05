import React, { Component } from "react";
import { Button } from "antd";
import PubSub from "pubsub-js";
import ReactGA from "react-ga";
import debugModule from "debug";

import Message from "../components/Message";
import GoogleMap from "./GoogleMap";
import { simpleMarker } from "./markers";
import AMap, { ADD_MARKERS_TOPIC, REMOVE_MARKERS_TOPIC } from "./AMap";
import MenuDrawer, { OPEN_DRAWER_TOPIC } from "../MenuDrawer";
import Warning from "../Warning";

import { getPhotos } from "../helpers/filesListHelpers";
import renderGoogleLoginBtn from "../helpers/renderGoogleLoginBtn";

const debug = debugModule("photo-map:src/Application/Map/index.jsx");
const amapCenter = { latitude: 39.871446, longitude: 116.215768 };
const googleMapCenter = { lat: 39.871446, lng: 116.215768 };

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gapiLoaded: false, // Google API loaded or not
      selectedMap: "amap",
      files: [],
      amapLoaded: false,
      message: "",
    };

    this.aMapMarkers = [];

    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleMapInstanceCreated = this.handleMapInstanceCreated.bind(this);
  }

  componentDidMount() {
    debug("componentDidMount()");

    // window.gapiLoadedFlag is defined in public/index.html
    // This flag is true only when Google API's platform.js is loaded, .
    if (window.gapiLoadedFlag) {
      this.setState({
        gapiLoaded: true,
        message: "Rendering Google login button...",
      });
    }
  }

  handleMapChange(name) {
    this.setState({
      selectedMap: name,
    });
  }

  handleRenderFinish = () => {
    this.setState({ message: "" });
  };

  /**
   * User success signed in Google account.
   * @param {gapi.auth2.GoogleUser} user
   */
  handleLoginSuccess(user) {
    debug("handleLoginSuccess", user);

    this.setState({
      message: "Login successfully, try to load photos in Google Drive...",
    });

    /**
     * https://github.com/google/google-api-javascript-client/blob/master/samples/simpleRequest.html
     */

    const gapiLoaed = async () => {
      debug("gapi client loaded.");

      const files = await getPhotos();

      this.setState({
        files,
        message: "",
      });

      PubSub.publish(ADD_MARKERS_TOPIC, files);
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
      PubSub.publish(REMOVE_MARKERS_TOPIC);
    });
    ReactGA.event({
      category: "Auth",
      action: "User logout",
    });
  };

  handleDrawerOpen = () => {
    PubSub.publish(OPEN_DRAWER_TOPIC);
  };

  render() {
    debug("render()", window.gapiLoaded);

    const { gapiLoaded, selectedMap, files, message } = this.state;

    if (!gapiLoaded) {
      return <Warning />;
    }

    const showAMap = selectedMap === "amap";

    return (
      <div className="map-wrapper">
        <Message message={message} />
        {showAMap ? (
          <AMap
            defaultCenter={amapCenter}
            defaultZoom={16}
            onMapInstanceCreated={this.handleMapInstanceCreated}
          />
        ) : (
          <GoogleMap
            defaultZoom={16}
            defaultCenter={googleMapCenter}
            markers={[simpleMarker]}
            files={files}
          />
        )}

        <div className="menu-btn-wrapper">
          <Button onClick={this.handleDrawerOpen}>Menu</Button>
        </div>
        <MenuDrawer
          onRenderFinish={this.handleRenderFinish}
          onLoginSuccess={this.handleLoginSuccess}
          onSignOutBtnClick={this.handleSignOutBtnClick}
          onMapChange={this.handleMapChange}
        />
      </div>
    );
  }
}
