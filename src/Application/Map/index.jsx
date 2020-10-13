import React, { Component } from "react";
import { Button } from "antd";
import PubSub from "pubsub-js";
import debugModule from "debug";

import { getPhotos } from "../helpers/filesListHelpers";
import Message from "../components/Message";
import GoogleMap, { FIT_MARKERS_TOPIC } from "./GoogleMap";
// import { simpleMarker } from "./markers";
import AMap, { REMOVE_MARKERS_TOPIC } from "./AMap";
import MenuDrawer, { OPEN_DRAWER_TOPIC } from "../MenuDrawer";
import { addMarkerToAMap } from "./helpers";

const debug = debugModule("photo-map:src/Application/Map/index.jsx");

const amapCenter = { latitude: 39.871446, longitude: 116.215768 };
const googleMapCenter = { lat: 39.871446, lng: 116.215768 };
const localStorageKeySelectedMap = "pmap::selectedMap";

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMap: "",
      files: [],
      amapLoaded: false,
      message: "Rendering Google login button...",
    };

    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleMapInstanceCreated = this.handleMapInstanceCreated.bind(this);
  }

  componentDidMount() {
    const selectedMap = localStorage.getItem(localStorageKeySelectedMap);
    if (selectedMap) {
      this.setState({ selectedMap });
    }
  }

  handleMapChange = (name) => {
    this.setState({
      selectedMap: name,
    });
    localStorage.setItem(localStorageKeySelectedMap, name);
  };

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
     * After gapi.client is loaded by gapi.load('client'), then you could use method like:
     * ```
     * gapi.client.request()
     * ```
     * https://github.com/google/google-api-javascript-client/blob/master/samples/simpleRequest.html
     */
    const gapiClientLoaded = async () => {
      debug("gapi client loaded.");

      // Load photos in private folder of login user's Google Drive
      const files = await getPhotos();

      this.setState({
        files,
        message: "",
      });

      if (this.state.selectedMap === "amap") {
        addMarkerToAMap(files);
      } else if (this.state.selectedMap === "google") {
        PubSub.publish(FIT_MARKERS_TOPIC);
      }
    };

    window.gapi.load("client", gapiClientLoaded);
  }

  handleMapInstanceCreated() {
    debug("handleMapInstanceCreated()", window.AMap);
    this.setState({ amapLoaded: true });
  }

  handleSignedOut = () => {
    this.setState({
      files: [],
    });
    PubSub.publish(REMOVE_MARKERS_TOPIC);
  };

  handleDrawerOpen = () => {
    PubSub.publish(OPEN_DRAWER_TOPIC);
  };

  render() {
    const { selectedMap, files, message } = this.state;

    let map = null;
    if (selectedMap === "amap") {
      map = (
        <AMap
          defaultCenter={amapCenter}
          defaultZoom={16}
          onMapInstanceCreated={this.handleMapInstanceCreated}
        />
      );
    } else if (selectedMap === "google") {
      map = (
        <GoogleMap
          defaultZoom={16}
          defaultCenter={googleMapCenter}
          markers={
            [
              /*simpleMarker*/
            ]
          }
          files={files}
        />
      );
    }

    return (
      <div className="map-wrapper">
        <Message message={message} />
        {map}
        <div className="menu-btn-wrapper">
          <Button onClick={this.handleDrawerOpen}>Menu</Button>
        </div>
        <MenuDrawer
          selectedMap={selectedMap}
          onRenderFinish={this.handleRenderFinish}
          onLoginSuccess={this.handleLoginSuccess}
          onSignedOut={this.handleSignedOut}
          onMapChange={this.handleMapChange}
        />
      </div>
    );
  }
}
