import React, { Component } from 'react';
import { Drawer, Button, Input, message } from 'antd';
import PubSub from 'pubsub-js';
import debugModule from 'debug';

import HelpTip from '../components/HelpTip';
import { ADD_MARKERS_TOPIC } from '../Map/AMap';
import { getPhotosInPublicFolder } from '../Map/helpers';
import MapSelector from '../Map/MapSelector';

import FolderList, { ADD_PUBLIC_FOLDER_TOPIC, decode } from './FolderList';
import Title from './Title';
import GoogleLogin from '../components/GoogleLogin';
import ConfigSection from './ConfigSection';
import { link2Id } from './helpers';
import { gapiOAuthClientId } from '../config';

const debug = debugModule('photo-map:src/Application/MenuDrawer/index.jsx');

// Open it
export const OPEN_DRAWER_TOPIC = 'menudrawer.open';
// Open or close it according to the state
export const OPEN_CLOSE_DRAWER_TOPIC = 'menudrawer.openclose';

export default class MenuDrawer extends Component {
  state = {
    drawerVisible: false,
    publicFolderLink: '',
    loading: false,
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
    if (this.state.loading) {
      message.warn(
        'Previous public folder is loading now, please wait a moment.'
      );
      return;
    }

    const folderId = link2Id(this.state.publicFolderLink);

    // Check whether folder exists
    if (decode()[folderId] !== undefined) {
      message.warn('There is an existing public folder!');
      return;
    }

    let folderInfo = null;
    try {
      this.setState({ loading: true });
      folderInfo = await getPhotosInPublicFolder(folderId);
      this.setState({ loading: false });
    } catch (error) {
      console.error('failed to get photos in a public folder, error:', error);
      message.error(error.message);
      this.setState({ loading: false });
      return;
    }

    PubSub.publish(ADD_PUBLIC_FOLDER_TOPIC, folderInfo);
    PubSub.publish(ADD_MARKERS_TOPIC, folderInfo);
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
    debug('render()');

    const { selectedMap } = this.props;
    const { drawerVisible, publicFolderLink } = this.state;

    return (
      <div className='menu-drawer'>
        <Drawer
          className='menu-drawer'
          width={'50%'}
          title={<Title />}
          placement='left'
          closable={false}
          forceRender
          open={drawerVisible}
          onClose={this.handleDrawerClose}
        >
          <MapSelector
            selectedMap={selectedMap}
            onChange={this.props.onMapChange}
          />
          <GoogleLogin
            clientId={gapiOAuthClientId}
            onLoginSuccess={this.props.onLoginSuccess}
            onRenderFinish={this.props.onRenderFinish}
            onSignedOut={this.props.onSignedOut}
          />
          <div>
            <div>
              Public folder link:{' '}
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
            <Button
              disabled={this.state.loading}
              onClick={this.handleLoadPublicFolderBtnClick}
            >
              Load
            </Button>
            <hr />
            <FolderList folders={this.props.folders} />
            <hr />
            <ConfigSection />
          </div>
        </Drawer>
      </div>
    );
  }
}
