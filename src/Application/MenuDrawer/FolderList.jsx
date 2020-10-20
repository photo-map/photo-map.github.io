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
  const content = {};
  value.forEach((folderInfo) => {
    content[folderInfo.folderId] = folderInfo.visible;
  });
  return JSON.stringify(content);
};
// // Decode the public folders content in localStorage to save to state
// // localStorage --(decode)-> React state
// const decode = () => {
//   return JSON.parse(localStorage.getItem(localStorageKeyPublicFolders));
// };

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

  renderPublicFolders = () => {
    const { publicFolders } = this.state;
    return (
      <div>
        <h3>Public Google Drive with photos</h3>
        {publicFolders.map((folderInfo) => {
          const handleChange = (event) => {
            this.updatePublicFolderVisiable(
              folderInfo.folderId,
              event.target.checked
            );
            PubSub.publish(
              event.target.checked ? SHOW_MARKERS_TOPIC : HIDE_MARKERS_TOPIC,
              {
                folderId: folderInfo.folderId,
              }
            );
          };

          return (
            <div key={folderInfo.folderId}>
              <Checkbox checked={folderInfo.visible} onChange={handleChange}>
                {folderInfo.folderName} : {folderInfo.folderId}
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
