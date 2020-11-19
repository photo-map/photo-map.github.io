import React, { Component } from "react";
import { Button } from "antd";
import PubSub from "pubsub-js";
import debugModule from "debug";

import { getPhotos } from "../helpers/filesListHelpers";
import Message from "../components/Message";
import GoogleMap, { FIT_MARKERS_TOPIC } from "./GoogleMap";
// import { simpleMarker } from "./markers";
import AMap, { REMOVE_ALL_MARKERS_TOPIC } from "./AMap";
import MenuDrawer, { OPEN_DRAWER_TOPIC } from "../MenuDrawer";
import { ADD_PUBLIC_FOLDER_TOPIC } from "../MenuDrawer/FolderList";
import { getPhotosInPublicFolders, addMarkerToAMap } from "./helpers";

const debug = debugModule("photo-map:src/Application/Map/index.jsx");

const amapCenter = { latitude: 39.871446, longitude: 116.215768 };
const googleMapCenter = { lat: 39.871446, lng: 116.215768 };
export const localStorageKeySelectedMap = "pmap::selectedMap";
export const SWITCH_MAP_TOPIC = "map.switchmap";

export default class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privatePhotos: [],
      publicPhotos: [],
      amapLoaded: false,
      message: "Rendering Google login button...",
    };

    this.state.selectedMap =
      localStorage.getItem(localStorageKeySelectedMap) || "amap";
  }

  componentDidMount() {
    this.addSubscribers();
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  handleMapChange = (name) => {
    this.setMap(name);
  };

  // GoogleLogin button render finished
  handleRenderFinish = () => {
    this.setState({ message: "" });
  };

  /**
   * User success signed in Google account.
   * @param {gapi.auth2.GoogleUser} user
   */
  handleLoginSuccess = async (user) => {
    debug("handleLoginSuccess", user);

    this.setState({
      message: "Login successfully, try to load photos in Google Drive...",
    });

    // Load photos in private folder of login user's Google Drive
    const privatePhotos = await getPhotos();

    this.setState({
      message: "",
      privatePhotos,
    });

    if (this.state.selectedMap === "amap") {
      await addMarkerToAMap(privatePhotos);
    } else if (this.state.selectedMap === "google") {
      const folders = await getPhotosInPublicFolders();
      folders.forEach((folderInfo) => {
        PubSub.publish(ADD_PUBLIC_FOLDER_TOPIC, folderInfo);
      });
      this.setPublicPhotosState(folders);
      PubSub.publish(FIT_MARKERS_TOPIC);
    }
  };

  handleMapInstanceCreated = () => {
    debug("handleMapInstanceCreated()", window.AMap);
    this.setState({ amapLoaded: true });
  };

  handleSignedOut = () => {
    this.setState({
      privatePhotos: [],
      publicPhotos: [],
    });
    PubSub.publish(REMOVE_ALL_MARKERS_TOPIC);
  };

  handleDrawerOpen = () => {
    PubSub.publish(OPEN_DRAWER_TOPIC);
  };

  addSubscribers = () => {
    this.switchMapToken = PubSub.subscribe(
      SWITCH_MAP_TOPIC,
      this.switchMapSubscriber
    );
  };

  removeSubscribers = () => {
    PubSub.unsubscribe(this.switchMapToken);
  };

  switchMapSubscriber = () => {
    this.setMap(this.state.selectedMap === "amap" ? "google" : "amap");
  };

  setMap = (name) => {
    this.setState({
      selectedMap: name,
    });
    localStorage.setItem(localStorageKeySelectedMap, name);
  };

  setPublicPhotosState = (folders) => {
    let newFiles = [];
    folders.forEach((folder) => {
      newFiles = [...newFiles, ...folder.files];
    });
    this.setState({
      publicPhotos: newFiles,
    });
  };

  render() {
    const { selectedMap, privatePhotos, publicPhotos, message } = this.state;

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
          files={[...privatePhotos, ...publicPhotos]}
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
