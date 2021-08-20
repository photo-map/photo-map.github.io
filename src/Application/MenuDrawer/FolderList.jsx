import React, { Component } from "react";
import { Checkbox, Button, Popconfirm } from "antd";
import PubSub from "pubsub-js";
import debugModule from "debug";

import {
  SHOW_MARKERS_TOPIC,
  HIDE_MARKERS_TOPIC,
  REMOVE_MARKERS_IN_FOLDER_TOPIC,
} from "../Map/AMap/constants";
import { PRIVATE_FOLDER_ID } from "../constants";

const debug = debugModule(
  "photo-map:src/Application/MenuDrawer/FolderList.jsx"
);

export const ADD_PUBLIC_FOLDER_TOPIC = "publicfolder.add";
export const localStorageKeyPublicFolders = "pmap:publicFolders";
export const localStorageKeyPrivateFolderVisible = "pmap:privateFolderVisible";

// Encode the public folders state to save in localStorage
// React state --(encode)-> localStorage
export const encode = (value) => {
  const content = {};
  value.forEach((folderInfo) => {
    content[folderInfo.folderId] = folderInfo.visible;
  });
  return JSON.stringify(content);
};
// Decode the public folders content in localStorage to save to state
// localStorage --(decode)-> React state
export const decode = () => {
  return JSON.parse(localStorage.getItem(localStorageKeyPublicFolders));
};

export default class FolderList extends Component {
  state = {
    // Whether to show photos in the private folder.
    privateFolderVisible: true,
    // The folder id, name and visible of public folders.
    // The key is folder ID from https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
    // [
    //   {folderId:"13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr",visible:true,name:"Dog Photos"}
    // ]
    publicFolders: [],
  };

  componentDidMount() {
    this.addSubscribers();

    // Load state from localStorage
    this.setState({
      privateFolderVisible:
        localStorage.getItem(localStorageKeyPrivateFolderVisible) === "true",
    });
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  // turn on/off the visible of private folder
  handlePrivateFolderCheckboxChange = (event) => {
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

  addPublicFolderSubscriber = (msg, folderInfo) => {
    this.addPublicFolder(folderInfo);
  };

  updatePrivateFolderVisible = (visible) => {
    this.setState({ privateFolderVisible: visible });
    localStorage.setItem(localStorageKeyPrivateFolderVisible, visible);
  };

  /**
   * @param {FolderInfo} folderInfo
   * @memberof FolderList
   */
  addPublicFolder = (folderInfo) => {
    const { publicFolders } = this.state;
    const newPublicFolderState = [...publicFolders, folderInfo];
    this.setState({
      publicFolders: newPublicFolderState,
    });
    localStorage.setItem(
      localStorageKeyPublicFolders,
      encode(newPublicFolderState)
    );
  };

  updatePublicFolderVisiable = (folderId, visible) => {
    const { publicFolders } = this.state;
    const newState = [...publicFolders];
    newState.forEach((folderInfo, index) => {
      if (folderInfo.folderId === folderId) {
        newState[index] = { ...folderInfo, visible };
      }
    });
    this.setState({
      publicFolders: newState,
    });
    localStorage.setItem(localStorageKeyPublicFolders, encode(newState));
  };

  updateMarkersVisible = (visible, folderId) => {
    PubSub.publish(visible ? SHOW_MARKERS_TOPIC : HIDE_MARKERS_TOPIC, {
      folderId,
    });
  };

  removePublicFolder = (folderId) => {
    this.setState((prevState) => {
      const newState = prevState.publicFolders.filter(
        (folderInfo) => folderInfo.folderId !== folderId
      );
      localStorage.setItem(localStorageKeyPublicFolders, encode(newState));
      return { publicFolders: newState };
    });
  };

  removeMarkersInFolder = (folderId) => {
    PubSub.publish(REMOVE_MARKERS_IN_FOLDER_TOPIC, {
      folderId,
    });
  };

  getPhotoCountInFolder = (folderId) => {
    let photoCountInFolder = "Unknown count";
    const folder = this.props.folders.find(
      (folder) => folder.folderId === folderId
    );
    if (folder) {
      photoCountInFolder = folder.files.length + "";
    }
    return photoCountInFolder;
  };

  renderPublicFolders = () => {
    const { publicFolders } = this.state;

    if (publicFolders.length === 0) {
      return "No data";
    }

    return publicFolders.map(this.renderPublicFolder);
  };

  renderPublicFolder = (folderInfo) => {
    const { folderId } = folderInfo;
    const handleChange = (event) => {
      this.updatePublicFolderVisiable(folderId, event.target.checked);
      this.updateMarkersVisible(event.target.checked, folderId);
    };

    const handleDelete = () => {
      this.removePublicFolder(folderId);
      this.removeMarkersInFolder(folderId);
    };

    return (
      <div key={folderInfo.folderId}>
        <Checkbox checked={folderInfo.visible} onChange={handleChange}>
          {folderInfo.folderName} ({this.getPhotoCountInFolder(folderId)}) :{" "}
          {folderInfo.folderId}{" "}
          <Popconfirm
            title="Are you sure delete this folder?"
            onConfirm={handleDelete}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" type="danger">
              Del
            </Button>
          </Popconfirm>
        </Checkbox>
      </div>
    );
  };

  render() {
    debug("render()", this.props, this.state);

    return (
      <div>
        <div>
          <h3>Private folder in Google Drive</h3>
          <Checkbox
            checked={this.state.privateFolderVisible}
            onChange={this.handlePrivateFolderCheckboxChange}
          >
            "Photo Map" folder in Google Drive of the login user (
            {this.getPhotoCountInFolder(PRIVATE_FOLDER_ID)})
          </Checkbox>
        </div>
        <div>
          <h3>Public folder in Google Drive</h3>
          {this.renderPublicFolders()}
        </div>
      </div>
    );
  }
}
