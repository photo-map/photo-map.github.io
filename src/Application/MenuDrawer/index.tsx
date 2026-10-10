import React, { Component } from 'react';
import { Drawer, Button, Input, message } from 'antd';
import PubSub from 'pubsub-js';
import debugModule from 'debug';

import HelpTip from '../components/HelpTip';
import { ADD_MARKERS_TOPIC } from '../Map/AMap';
import { getPhotosInPublicFolder } from '../Map/helpers';

import FolderList, { ADD_PUBLIC_FOLDER_TOPIC, decode } from './FolderList';
import Title from './Title';
import GoogleLogin from '../components/GoogleLogin';
import ConfigSection from './ConfigSection';
import { link2Id } from './helpers';
import { gapiOAuthClientId } from '../config';
import type { PhotoFolder } from '../types';

const debug = debugModule('photo-map:src/Application/MenuDrawer/index.tsx');

// Open it
export const OPEN_DRAWER_TOPIC = 'menudrawer.open';
// Open or close it according to the state
export const OPEN_CLOSE_DRAWER_TOPIC = 'menudrawer.openclose';

interface MenuDrawerProps {
  folders: PhotoFolder[];
  onRenderFinish: () => void;
  onLoginSuccess: (user: any) => void;
  onSignedOut: () => void;
}

interface MenuDrawerState {
  drawerVisible: boolean;
  publicFolderLink: string;
  loading: boolean;
}

export default class MenuDrawer extends Component<
  MenuDrawerProps,
  MenuDrawerState
> {
  state = {
    drawerVisible: false,
    publicFolderLink: '',
    loading: false,
  };

  // 在 addSubscribers()（componentDidMount 中调用）里赋值
  private openDrawerToken!: string;
  private openCloseDrawerToken!: string;

  componentDidMount() {
    this.addSubscribers();
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  handleDrawerClose = () => {
    this.setVisible(false);
  };

  handlePublicFolderLinkChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      // 存量 bug 修正：antd v5 移除了 message.warn（原代码运行时是 undefined 调用，会崩）
      message.warning(
        'Previous public folder is loading now, please wait a moment.'
      );
      return;
    }

    const folderId = link2Id(this.state.publicFolderLink);

    // Check whether folder exists
    // 原 JS 在 decode() 返回 null（localStorage 里没有该 key）时会抛 TypeError，
    // 这里顺手加固为「当作不存在」处理
    const existingFolders = decode();
    if (existingFolders && existingFolders[folderId] !== undefined) {
      // 同上：antd v5 的 message.warn → message.warning
      message.warning('There is an existing public folder!');
      return;
    }

    let folderInfo: PhotoFolder | null = null;
    try {
      this.setState({ loading: true });
      folderInfo = await getPhotosInPublicFolder(folderId);
      this.setState({ loading: false });
    } catch (error: any) {
      console.error('failed to get photos in a public folder, error:', error);
      message.error(error.message);
      this.setState({ loading: false });
      return;
    }

    PubSub.publish(ADD_PUBLIC_FOLDER_TOPIC, folderInfo);
    PubSub.publish(ADD_MARKERS_TOPIC, folderInfo);
  };

  setVisible = (visible: boolean) => {
    this.setState({ drawerVisible: visible });
  };

  openDrawerSubscriber = (msg: any) => {
    this.setVisible(true);
  };

  openCloseDrawerSubscriber = (msg: any) => {
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