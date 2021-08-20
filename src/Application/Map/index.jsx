import React, { Component } from "react";
import { Button } from "antd";
import PubSub from "pubsub-js";
import debugModule from "debug";

import {
  GOOGLE_MAP,
  A_MAP,
  BAIDU_MAP,
  DEFAULT_SELECTED_MAP,
  PRIVATE_FOLDER_ID,
} from "../constants";
import { getPrivatePhotos } from "../helpers/filesListHelpers";
import Message from "../components/Message";
import GoogleMap from "./GoogleMap";
// import { simpleMarker } from "./markers";
import AMap, { REMOVE_ALL_MARKERS_TOPIC } from "./AMap";
import BaiduMap from "./BaiduMap";
import MenuDrawer, { OPEN_DRAWER_TOPIC } from "../MenuDrawer";
import { ADD_PUBLIC_FOLDER_TOPIC } from "../MenuDrawer/FolderList";
import {
  getPublicFoldersWithPhoto,
  addMarkersToAMap,
  getGpsBMapPointsMapping,
} from "./helpers";
import { localStorageKeySelectedMap } from "./constants";

const debug = debugModule("photo-map:src/Application/Map/index.jsx");

const amapCenter = { latitude: 39.871446, longitude: 116.215768 };
const googleMapCenter = { lat: 39.871446, lng: 116.215768 };
const baiduMapCenter = { lng: 116.215768, lat: 39.871446 };
const defaultZoom = 16;

export const SWITCH_MAP_TOPIC = "map.switchmap";
export const SHOW_MARKERS_TOPIC = "amap.showmarkers"; // TODO duplicated with src/Application/Map/AMap/index.jsx
export const HIDE_MARKERS_TOPIC = "amap.hidemarkers"; // TODO duplicated with src/Application/Map/AMap/index.jsx
// Fitbounds to the markers showing on the map
export const FIT_MARKERS_TOPIC = "googlemap.fitmarkers";

/**
 * The mapping between GPS coordinates and BMap coordinates
 *
 * ```json
 * {
 *   "1,103": {"lat":1,"lng":103},
 *   "2,103": {"lat":2,"lng":103}
 * }
 * ```
 *
 * @typedef {Map<string,BMapPoint>} GpsBMapPointsMapping
 */

export default class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Folders in GDrive which contains photos, both private and public folder
      // [
      //   {"folderId":"", "files":[]},
      //   {"folderId":"", "files":[]}
      // ]
      /**
       * @type {import("./helpers").PhotoFolder[]}
       */
      folders: [],
      /**
       * @type {GpsBMapPointsMapping}
       */
      gpsBMapPointsMapping: {},
      amapLoaded: false,
      message: "Rendering Google login button on left side panel...",
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
    const privatePhotos = await getPrivatePhotos();

    this.setState({
      message: "",
    });

    // If private folder alread in state, then update it in state.
    // If private folder not in state, then push it into state.
    this.setState((prevState) => {
      let foundPrivateFolder = false;
      const folders = prevState.folders.map((folder) => {
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
      return {
        folders,
      };
    });

    // Update public folder in state
    const publicFolders = await getPublicFoldersWithPhoto();
    this.setState((prevState) => ({
      folders: [...prevState.folders, ...publicFolders],
    }));

    publicFolders.forEach((folderInfo) => {
      PubSub.publish(ADD_PUBLIC_FOLDER_TOPIC, folderInfo);
    });

    // Convert to baidu map coordinate system
    if (window.BMapGL) {
      const gpsBMapPointsMapping = await getGpsBMapPointsMapping(
        this.state.folders
      );
      this.setState({
        gpsBMapPointsMapping,
      });
    }

    if (this.state.selectedMap === "amap") {
      await addMarkersToAMap(privatePhotos);
    }

    PubSub.publish(FIT_MARKERS_TOPIC);
  };

  handleAMapInstanceCreated = (map) => {
    // window.AMap is init in original amap lib
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

  // will reload whole map when switching map
  renderMap = () => {
    const { selectedMap, folders } = this.state;
    if (selectedMap === A_MAP) {
      return (
        <AMap
          defaultCenter={amapCenter}
          defaultZoom={defaultZoom}
          onMapInstanceCreated={this.handleAMapInstanceCreated}
        />
      );
    } else if (selectedMap === GOOGLE_MAP) {
      return (
        <GoogleMap
          defaultZoom={defaultZoom}
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
    return null;
  };

  // will not reload whole map when swiching map
  renderMap2 = () => {
    const { selectedMap, folders } = this.state;

    return (
      <div className={`selected-map-${selectedMap}`}>
        <div
          className={`photo-map-google-map ${
            selectedMap === GOOGLE_MAP ? "show" : "hide"
          }`}
        >
          <GoogleMap
            defaultZoom={defaultZoom}
            defaultCenter={googleMapCenter}
            markers={
              [
                /*simpleMarker*/
              ]
            }
            folders={folders}
          />
        </div>
        <div
          className={`photo-map-a-map ${
            selectedMap === A_MAP ? "show" : "hide"
          }`}
        >
          <AMap
            defaultCenter={amapCenter}
            defaultZoom={16}
            onMapInstanceCreated={this.handleAMapInstanceCreated}
          />
        </div>
        <div
          className={`photo-map-baidu-map ${
            selectedMap === BAIDU_MAP ? "show" : "hide"
          }`}
        >
          <BaiduMap
            defaultCenter={baiduMapCenter}
            defaultZoom={defaultZoom}
            folders={folders}
            gpsBMapPointsMapping={this.state.gpsBMapPointsMapping}
          />
        </div>
      </div>
    );
  };

  render() {
    const { selectedMap, message } = this.state;

    return (
      <div className="map-wrapper">
        <Message message={message} />
        {this.renderMap2()}
        <div className="menu-btn-wrapper">
          <Button onClick={this.handleDrawerOpen}>Menu</Button>
        </div>
        <MenuDrawer
          selectedMap={selectedMap}
          folders={this.state.folders}
          onRenderFinish={this.handleRenderFinish}
          onLoginSuccess={this.handleLoginSuccess}
          onSignedOut={this.handleSignedOut}
          onMapChange={this.handleMapChange}
        />
      </div>
    );
  }
}
