import React, { Component } from "react";
import { Drawer, Button, Input, message } from "antd";
import PubSub from "pubsub-js";
import debugModule from "debug";

import HelpTip from "../components/HelpTip";
import { ADD_MARKERS_TOPIC } from "../Map/AMap";
import MapSelector from "../Map/MapSelector";

import { getPhotosInFolder } from "../helpers/filesListHelpers";
import FolderList, { ADD_PUBLIC_FOLDER_TOPIC } from "./FolderList";
import Title from "./Title";
import GoogleLogin from "./GoogleLogin";

const debug = debugModule("photo-map:src/Application/MenuDrawer/index.jsx");

// Open it
export const OPEN_DRAWER_TOPIC = "menudrawer.open";
// Open or close it according to the state
export const OPEN_CLOSE_DRAWER_TOPIC = "menudrawer.openclose";

export default class MenuDrawer extends Component {
  state = {
    drawerVisible: false,
    publicFolderLink: "",
  };

  componentDidMount() {
    this.addSubscribers();
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  handleDrawerClose = () => {
    this.setVisible(false);
  };

  handlePublicFolderLinkChange = (event) => {
    this.setState({ publicFolderLink: event.target.value });
  };

  handlePublicFolderInputPressEnter = () => {
    this.loadPublicFolderAndAddMarkers();
  };

  handleLoadPublicFolderBtnClick = () => {
    this.loadPublicFolderAndAddMarkers();
  };

  loadPublicFolderAndAddMarkers = async () => {
    // Convert folder web link: https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
    // to folder ID: 13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr
    const folderId = this.state.publicFolderLink
      .replace("https://drive.google.com/drive/folders/", "")
      .replace("?usp=sharing", "");
    // Get photos from public folder
    const resp = await getPhotosInFolder(folderId);
    if (resp.error) {
      message.error(resp.error.message);
      return;
    }
    PubSub.publish(ADD_PUBLIC_FOLDER_TOPIC, folderId);
    PubSub.publish(ADD_MARKERS_TOPIC, {
      files: resp.files,
      visible: true,
      folderId,
    });
  };

  setVisible = (visible) => {
    this.setState({ drawerVisible: visible });
  };

  openDrawerSubscriber = (msg) => {
    this.setVisible(true);
  };

  openCloseDrawerSubscriber = (msg) => {
    this.setVisible(!this.state.drawerVisible);
  };

  addSubscribers = () => {
    this.openDrawerToken = PubSub.subscribe(
      OPEN_DRAWER_TOPIC,
      this.openDrawerSubscriber
    );
    this.openCloseDrawerToken = PubSub.subscribe(
      OPEN_CLOSE_DRAWER_TOPIC,
      this.openCloseDrawerSubscriber
    );
  };

  removeSubscribers = () => {
    PubSub.unsubscribe(this.openDrawerToken);
  };

  render() {
    debug("render()");

    const { selectedMap } = this.props;
    const { drawerVisible, publicFolderLink } = this.state;

    return (
      <div className="menu-drawer">
        <Drawer
          className="menu-drawer"
          width={512}
          title={<Title />}
          placement="left"
          closable={false}
          forceRender
          visible={drawerVisible}
          onClose={this.handleDrawerClose}
        >
          <MapSelector
            selectedMap={selectedMap}
            onChange={this.props.onMapChange}
          />
          <GoogleLogin
            onLoginSuccess={this.props.onLoginSuccess}
            onRenderFinish={this.props.onRenderFinish}
            onSignedOut={this.props.onSignedOut}
          />
          <div>
            <div>
              Public folder link:{" "}
              <HelpTip>
                <div>
                  <div>Please fill the public folder link. For example:</div>
                  <div>
                    https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
                  </div>
                </div>
              </HelpTip>
            </div>
            <Input
              value={publicFolderLink}
              onChange={this.handlePublicFolderLinkChange}
              onPressEnter={this.handlePublicFolderInputPressEnter}
            />
            <Button onClick={this.handleLoadPublicFolderBtnClick}>Load</Button>
            <hr />
            <FolderList />
          </div>
        </Drawer>
      </div>
    );
  }
}
