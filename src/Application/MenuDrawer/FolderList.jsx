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
        ? JSON.parse(localStorage.getItem(localStorageKeyPublicFolders))
        : {},
    });
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  handleChange = (event) => {
    const { checked } = event.target;
    this.setState({ privateFolderVisible: checked });
    localStorage.setItem(localStorageKeyPrivateFolderVisible, checked);
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
    // React state --(encode)-> localStorage
    const encode = (value) => {
      return JSON.stringify(value);
    };
    // localStorage --(decode)-> React state
    const decode = () => {
      return JSON.parse(localStorage.getItem(localStorageKeyPublicFolders));
    };
    localStorage.setItem(
      localStorageKeyPublicFolders,
      encode({
        ...decode(),
        [folderId]: true,
      })
    );
  };

  renderPublicFolders = () => {
    const { publicFolders } = this.state;
    return (
      <div>
        <h3>Public Google Drive with photos</h3>
        {Object.keys(publicFolders).map((folderId) => {
          const handleChange = (event) => {
            const newState = {
              ...publicFolders,
              [folderId]: event.target.checked,
            };
            this.setState({
              publicFolders: newState,
            });
            localStorage.setItem(
              localStorageKeyPublicFolders,
              JSON.stringify(newState)
            );
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
