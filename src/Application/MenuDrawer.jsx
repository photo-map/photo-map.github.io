import React, { Component } from "react";
import { Drawer, Button, Input } from "antd";
import PubSub from "pubsub-js";
import ReactGA from "react-ga";
import debugModule from "debug";

import { ADD_MARKERS_TOPIC } from "./Map/AMap";
import MapSelector from "./Map/MapSelector";

import { getPhotosInFolder } from "./helpers/filesListHelpers";
import renderGoogleLoginBtn from "./helpers/renderGoogleLoginBtn";

const debug = debugModule("photo-map:src/Application/MenuDrawer.jsx");

export const OPEN_DRAWER_TOPIC = "menudrawer.open";

export default class MenuDrawer extends Component {
  state = {
    drawerVisible: false,
    publicFolderLink: "",
  };

  componentDidMount() {
    this.addSubscribers();
    renderGoogleLoginBtn({
      onLoginSuccess: this.props.onLoginSuccess,
      onRenderFinish: this.props.onRenderFinish,
    });
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
    PubSub.publish(ADD_MARKERS_TOPIC, resp.files);
  };

  setVisible = (visible) => {
    this.setState({ drawerVisible: visible });
  };

  addSubscribers = () => {
    const openDrawerSubscriber = (msg) => {
      this.setVisible(true);
    };

    this.openDrawerToken = PubSub.subscribe(
      OPEN_DRAWER_TOPIC,
      openDrawerSubscriber
    );
  };

  removeSubscribers = () => {
    PubSub.unsubscribe(this.openDrawerToken);
  };

  render() {
    debug("render()");

    const { drawerVisible, publicFolderLink } = this.state;

    return (
      <div className="menu-drawer">
        <Drawer
          className="menu-drawer"
          placement="right"
          closable={false}
          forceRender
          visible={drawerVisible}
          onClose={this.handleDrawerClose}
        >
          <MapSelector onChange={this.props.onMapChange} />
          <div>
            <div id="custom-google-login-button" />
            <button onClick={this.props.onSignOutBtnClick}>Sign out</button>
            <ReactGA.OutboundLink
              eventLabel="HowToUse"
              to="https://github.com/photo-map/photo-map.github.io/blob/master/help/HOW_TO_USE.md#how-to-use"
              target="_blank"
            >
              How to use
            </ReactGA.OutboundLink>
            <div>Please fill the public folder link</div>
            <div>
              e.g.
              https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
            </div>
            <Input
              value={publicFolderLink}
              onChange={this.handlePublicFolderLinkChange}
              onPressEnter={this.handlePublicFolderInputPressEnter}
            />
            <Button onClick={this.handleLoadPublicFolderBtnClick}>Load</Button>
          </div>
        </Drawer>
      </div>
    );
  }
}
