import { Component } from 'react';
import { Button, message } from 'antd';
import PubSub from 'pubsub-js';
import ReactGA from 'react-ga';
import debugModule from 'debug';

import { PRIVATE_FOLDER_ID } from '../constants';
import {
  getJsonFilesInFolder,
  getPrivatePhotos,
} from '../helpers/filesListHelpers';
import Message from '../components/Message';
import AMap, { REMOVE_ALL_MARKERS_TOPIC } from './AMap';
import MenuDrawer, { OPEN_DRAWER_TOPIC } from '../MenuDrawer';
import { ADD_PUBLIC_FOLDER_TOPIC } from '../MenuDrawer/FolderList';
import { getPublicFoldersWithPhoto, addMarkersToAMap } from './helpers';
import { FIT_MARKERS_TOPIC } from './constants';
import { files } from '../utils/gDriveFilesApi';
import type { PhotoFolder } from '../types';

const debug = debugModule('photo-map:src/Application/Map/index.tsx');

const amapCenter = { latitude: 39.871446, longitude: 116.215768 };
const defaultZoom = 16;

export const SHOW_MARKERS_TOPIC = 'amap.showmarkers'; // TODO duplicated with src/Application/Map/AMap/index.tsx
export const HIDE_MARKERS_TOPIC = 'amap.hidemarkers'; // TODO duplicated with src/Application/Map/AMap/index.tsx

export default class Map extends Component<{}, MapState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // Folders in GDrive which contains photos, both private and public folder
      // [
      //   {"folderId":"", "files":[]},
      //   {"folderId":"", "files":[]}
      // ]
      folders: [],
      amapLoaded: false,
      message: 'Rendering Google login button on left side panel...',
    };
  }

  // PubSub.subscribe() 返回的 token，在 addSubscribers()（componentDidMount 中）赋值
  private showMarkersToken!: string;
  private hideMarkersToken!: string;

  componentDidMount() {
    this.addSubscribers();
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  // GoogleLogin button render finished
  handleRenderFinish = () => {
    this.setState({ message: '' });
  };

  /**
   * User success signed in Google account.
   * @param {gapi.auth2.GoogleUser} user
   */
  handleLoginSuccess = async (user: any) => {
    debug('handleLoginSuccess', user);

    ReactGA.event({
      category: 'Auth',
      action: 'User login',
    });

    this.setState({
      message: 'Login successfully, try to load photos in Google Drive...',
    });

    // Load photos in private folder of login user's Google Drive
    const privatePhotos = await getPrivatePhotos();

    this.setState({
      message: '',
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

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('app') === 'trainSearch') {
      // 原 JS 直接传 urlParams.get('folderId')（可能是 null），此处用非空断言保持同一运行时行为
      getJsonFilesInFolder(urlParams.get('folderId')!).then((resp) => {
        console.log('getJsonFilesInFolder resp', resp);
        return resp.files
          .filter(
            (f) =>
              f.name === `trainsMap_${urlParams.get('date')}.json` ||
              f.name === `trainsFullInfoMap_${urlParams.get('date')}.json`
          )
          .forEach((f) => {
            files
              .get({
                fileId: f.id, // '1tK...74I',
                alt: 'media',
              })
              .then((resp) => {
                console.log('[TrainSearch] files.get resp', f.name, resp);
                message.success(`Load ${f.name} successfully`);
                // filter 已保证 f.name 匹配 trainsMap_*.json 模式，此处必非空
                window.PM_trainsMap[f.name!] = resp;
              });
          });
      });
    }

    await addMarkersToAMap(privatePhotos);

    PubSub.publish(FIT_MARKERS_TOPIC);
  };

  handleAMapInstanceCreated = (map: any) => {
    // window.AMap is init in original amap lib
    debug('handleAMapInstanceCreated()', window.AMap);
    this.setState({ amapLoaded: true });
  };

  handleSignedOut = () => {
    ReactGA.event({
      category: 'Auth',
      action: 'User logout',
    });

    this.setState({
      folders: [],
    });
    PubSub.publish(REMOVE_ALL_MARKERS_TOPIC);
  };

  handleDrawerOpen = () => {
    PubSub.publish(OPEN_DRAWER_TOPIC);
  };

  addSubscribers = () => {
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
    PubSub.unsubscribe(this.showMarkersToken);
    PubSub.unsubscribe(this.hideMarkersToken);
  };

  showMarkersSubscriber = (msg: any, filter: { folderId: string }) => {
    this.updateMarkersInFolderVisible(filter.folderId, true);
  };

  hideMarkersSubscriber = (msg: any, filter: { folderId: string }) => {
    this.updateMarkersInFolderVisible(filter.folderId, false);
  };

  updateMarkersInFolderVisible = (folderId: string, visible: boolean) => {
    const newFolders = this.state.folders.map((folder) => {
      if (folder.folderId === folderId) {
        folder.visible = visible;
      }
      return folder;
    });
    // 存量笔误修正：原 JS 写的是 `{ folder: newFolders }`（state 无此键，更新失效），
    // 该写法在 setState 的部分类型检查下无法编译，按开放问题 1 的豁免就地修正
    this.setState({ folders: newFolders });
  };

  renderMap = () => {
    return (
      <AMap
        defaultCenter={amapCenter}
        defaultZoom={defaultZoom}
        onMapInstanceCreated={this.handleAMapInstanceCreated}
      />
    );
  };

  render() {
    const { message } = this.state;

    return (
      <div className='map-wrapper'>
        <Message message={message} />
        {this.renderMap()}
        <div className='menu-btn-wrapper'>
          <Button onClick={this.handleDrawerOpen}>Menu</Button>
        </div>
        <MenuDrawer
          folders={this.state.folders}
          onRenderFinish={this.handleRenderFinish}
          onLoginSuccess={this.handleLoginSuccess}
          onSignedOut={this.handleSignedOut}
        />
      </div>
    );
  }
}

interface MapState {
  folders: PhotoFolder[];
  amapLoaded: boolean;
  message: string;
}
