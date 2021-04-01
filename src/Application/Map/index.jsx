import React, { Component } from "react";
import { Button } from "antd";
import PubSub from "pubsub-js";
import debugModule from "debug";

import {
  GOOGLE_MAP,
  A_MAP,
  DEFAULT_SELECTED_MAP,
  PRIVATE_FOLDER_ID,
} from "../constants";
import { getPhotos } from "../helpers/filesListHelpers";
import Message from "../components/Message";
import GoogleMap from "./GoogleMap";
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
export const SHOW_MARKERS_TOPIC = "amap.showmarkers";
export const HIDE_MARKERS_TOPIC = "amap.hidemarkers";
// Fitbounds to the markers showing on the map
export const FIT_MARKERS_TOPIC = "googlemap.fitmarkers";

export default class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Folders in GDrive which contains photos
      // [
      //   {"folderId":"", "files":""},
      //   {"folderId":"", "files":""}
      // ]
      folders: [],
      amapLoaded: false,
      message: "Rendering Google login button...",
    };

    this.state.selectedMap =
      localStorage.getItem(localStorageKeySelectedMap) || DEFAULT_SELECTED_MAP;
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
    });

    // Update private folder in state
    let foundPrivateFolder = false;
    const folders = this.state.folders.map((folder) => {
      if (folder.folderId === PRIVATE_FOLDER_ID) {
        foundPrivateFolder = true;
        folder.files = privatePhotos;
      }
      return folder;
    });
    if (!foundPrivateFolder) {
      folders.push({
        folderId: PRIVATE_FOLDER_ID,
        files: privatePhotos,
      });
    }
    this.setState({ folders });

    // Update public folder in state
    const publicFolders = await getPhotosInPublicFolders();
    this.setState({
      folders: [...this.state.folders, ...publicFolders],
    });
    publicFolders.forEach((folderInfo) => {
      PubSub.publish(ADD_PUBLIC_FOLDER_TOPIC, folderInfo);
    });

    if (this.state.selectedMap === "amap") {
      await addMarkerToAMap(privatePhotos);
    }

    PubSub.publish(FIT_MARKERS_TOPIC);
  };

  handleAMapInstanceCreated = () => {
    debug("handleAMapInstanceCreated()", window.AMap);
    this.setState({ amapLoaded: true });
  };

  handleSignedOut = () => {
    this.setState({
      folders: [],
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
    this.showMarkersToken = PubSub.subscribe(
      SHOW_MARKERS_TOPIC,
      this.showMarkersSubscriber
    );
    this.hideMarkersToken = PubSub.subscribe(
      HIDE_MARKERS_TOPIC,
      this.hideMarkersSubscriber
    );
  };

  removeSubscribers = () => {
    PubSub.unsubscribe(this.switchMapToken);
  };

  switchMapSubscriber = () => {
    this.setMap(this.state.selectedMap === A_MAP ? GOOGLE_MAP : A_MAP);
  };

  showMarkersSubscriber = (msg, filter) => {
    this.updateMarkersInFolderVisible(filter.folderId, true);
  };

  hideMarkersSubscriber = (msg, filter) => {
    this.updateMarkersInFolderVisible(filter.folderId, false);
  };

  updateMarkersInFolderVisible = (folderId, visible) => {
    const newFolders = this.state.folders.map((folder) => {
      if (folder.folderId === folderId) {
        folder.visible = visible;
      }
      return folder;
    });
    this.setState({ folder: newFolders });
  };

  setMap = (name) => {
    this.setState({
      selectedMap: name,
    });
    localStorage.setItem(localStorageKeySelectedMap, name);
  };

  render() {
    const { selectedMap, folders, message } = this.state;

    let map = null;
    if (selectedMap === A_MAP) {
      map = (
        <AMap
          defaultCenter={amapCenter}
          defaultZoom={16}
          onMapInstanceCreated={this.handleAMapInstanceCreated}
        />
      );
    } else if (selectedMap === GOOGLE_MAP) {
      map = (
        <GoogleMap
          defaultZoom={16}
          defaultCenter={googleMapCenter}
          markers={
            [
              /*simpleMarker*/
            ]
          }
          folders={folders}
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
