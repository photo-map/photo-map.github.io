import React, { Component } from "react";
import { Checkbox } from "antd";
import PubSub from "pubsub-js";
import debugModule from "debug";

import {
  SHOW_MARKERS_TOPIC,
  HIDE_MARKERS_TOPIC,
  PRIVATE_FOLDER_ID,
} from "../Map/AMap";

const debug = debugModule(
  "photo-map:src/Application/MenuDrawer/FolderList.jsx"
);

export const ADD_PUBLIC_FOLDER_TOPIC = "publicfolder.add";
export const localStorageKeyPublicFolders = "pmap:publicFolders";
export const localStorageKeyPrivateFolderVisible = "pmap:privateFolderVisible";

// Encode the public folders state to save in localStorage
// React state --(encode)-> localStorage
const encode = (value) => {
  return JSON.stringify(value);
};
// Decode the public folders content in localStorage to save to state
// localStorage --(decode)-> React state
const decode = () => {
  return JSON.parse(localStorage.getItem(localStorageKeyPublicFolders));
};

export default class FolderList extends Component {
  state = {
    // Whether to show photos in the private folder.
    privateFolderVisible: true,
    // The id and visible of public folders.
    // The key is folder ID from https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
    // {
    //   "13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr":true
    // }
    publicFolders: {},
  };

  componentDidMount() {
    this.addSubscribers();

    // Load state from localStorage
    this.setState({
      privateFolderVisible:
        localStorage.getItem(localStorageKeyPrivateFolderVisible) === "true",
      publicFolders: localStorage.getItem(localStorageKeyPublicFolders)
        ? decode()
        : {},
    });
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  handleChange = (event) => {
    const { checked } = event.target;
    this.updatePrivateFolderVisible(checked);
    PubSub.publish(checked ? SHOW_MARKERS_TOPIC : HIDE_MARKERS_TOPIC, {
      folderId: PRIVATE_FOLDER_ID,
    });
  };

  addSubscribers = () => {
    this.openDrawerToken = PubSub.subscribe(
      ADD_PUBLIC_FOLDER_TOPIC,
      this.addPublicFolderSubscriber
    );
  };

  removeSubscribers = () => {
    PubSub.unsubscribe(this.openDrawerToken);
  };

  addPublicFolderSubscriber = (msg, folderId) => {
    this.addPublicFolder(folderId);
  };

  updatePrivateFolderVisible = (visible) => {
    this.setState({ privateFolderVisible: visible });
    localStorage.setItem(localStorageKeyPrivateFolderVisible, visible);
  };

  addPublicFolder = (folderId) => {
    const { publicFolders } = this.state;
    const newState = {
      ...publicFolders,
      [folderId]: true,
    };
    this.setState({
      publicFolders: newState,
    });
    localStorage.setItem(localStorageKeyPublicFolders, encode(newState));
  };

  updatePublicFolderVisiable = (folderId, visible) => {
    const { publicFolders } = this.state;
    const newState = {
      ...publicFolders,
      [folderId]: visible,
    };
    this.setState({
      publicFolders: newState,
    });
    localStorage.setItem(localStorageKeyPublicFolders, encode(newState));
  };

  renderPublicFolders = () => {
    const { publicFolders } = this.state;
    return (
      <div>
        <h3>Public Google Drive with photos</h3>
        {Object.keys(publicFolders).map((folderId) => {
          const handleChange = (event) => {
            this.updatePublicFolderVisiable(folderId, event.target.checked);
            PubSub.publish(
              event.target.checked ? SHOW_MARKERS_TOPIC : HIDE_MARKERS_TOPIC,
              {
                folderId,
              }
            );
          };

          return (
            <div key={folderId}>
              <Checkbox
                checked={publicFolders[folderId]}
                onChange={handleChange}
              >
                Public folder ID {folderId}
              </Checkbox>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    debug("render()", this.props, this.state);

    return (
      <div>
        <div>
          <h3>"Photo Map" folder in Google Drive of the login user</h3>
          <Checkbox
            checked={this.state.privateFolderVisible}
            onChange={this.handleChange}
          >
            "Photo Map" folder in Google Drive of the login user
          </Checkbox>
        </div>
        {this.renderPublicFolders()}
      </div>
    );
  }
}
