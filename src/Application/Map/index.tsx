import { Component } from 'react';
import { Button, message } from 'antd';
import PubSub from 'pubsub-js';
import ReactGA from 'react-ga';
import debugModule from 'debug';

import {
  GOOGLE_MAP,
  A_MAP,
  BAIDU_MAP,
  DEFAULT_SELECTED_MAP,
  PRIVATE_FOLDER_ID,
} from '../constants';
import {
  getJsonFilesInFolder,
  getPrivatePhotos,
} from '../helpers/filesListHelpers';
import Message from '../components/Message';
import AMap, { REMOVE_ALL_MARKERS_TOPIC } from './AMap';
import MenuDrawer, { OPEN_DRAWER_TOPIC } from '../MenuDrawer';
import { ADD_PUBLIC_FOLDER_TOPIC } from '../MenuDrawer/FolderList';
import {
  getPublicFoldersWithPhoto,
  addMarkersToAMap,
  getGpsBMapPointsMapping,
} from './helpers';
import { localStorageKeySelectedMap, FIT_MARKERS_TOPIC } from './constants';
import { files } from '../utils/gDriveFilesApi';
import type { PhotoFolder } from '../types';
import type { GpsBMapPointsMapping } from './BaiduMap/types';

// GoogleMap/BaiduMap 真实组件已删除（阶段 5 死代码清理），用占位 div 顶替。
// 背景见 docs/plans/0001-typescript-migration.md「阶段 4 实测」。
const GoogleMap = (_props: any) => <div>GoogleMap</div>;
const BaiduMap = (_props: any) => <div>BaiduMap</div>;

const debug = debugModule('photo-map:src/Application/Map/index.tsx');

const amapCenter = { latitude: 39.871446, longitude: 116.215768 };
const googleMapCenter = { lat: 39.871446, lng: 116.215768 };
const baiduMapCenter = { lng: 116.215768, lat: 39.871446 };
const defaultZoom = 16;

export const SWITCH_MAP_TOPIC = 'map.switchmap';
export const SHOW_MARKERS_TOPIC = 'amap.showmarkers'; // TODO duplicated with src/Application/Map/AMap/index.tsx
export const HIDE_MARKERS_TOPIC = 'amap.hidemarkers'; // TODO duplicated with src/Application/Map/AMap/index.tsx

/**
 * 地图坐标（经度/维度）。原文件里是 JSDoc @typedef {Map<string,BMapPoint>}，
 * 迁移后统一指向 BaiduMap/types.ts 的 GpsBMapPointsMapping（plan 约定：不再维护 JSDoc @typedef）。
 */

export default class Map extends Component<{}, MapState> {
  constructor(props: {}) {
    super(props);

    // 原 JS 在 state 字面量之后单独赋 this.state.selectedMap，语义相同，合并进字面量
    this.state = {
      // Folders in GDrive which contains photos, both private and public folder
      // [
      //   {"folderId":"", "files":[]},
      //   {"folderId":"", "files":[]}
      // ]
      folders: [],
      gpsBMapPointsMapping: {},
      amapLoaded: false,
      message: 'Rendering Google login button on left side panel...',
      selectedMap:
        localStorage.getItem(localStorageKeySelectedMap) || DEFAULT_SELECTED_MAP,
    };
  }

  // PubSub.subscribe() 返回的 token，在 addSubscribers()（componentDidMount 中）赋值
  private switchMapToken!: string;
  private showMarkersToken!: string;
  private hideMarkersToken!: string;

  componentDidMount() {
    this.addSubscribers();
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  handleMapChange = (name: string) => {
    this.setMap(name);
  };

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

    // Convert to baidu map coordinate system
    if (window.BMapGL) {
      const gpsBMapPointsMapping = await getGpsBMapPointsMapping(
        this.state.folders
      );
      this.setState({
        gpsBMapPointsMapping,
      });
    }

    if (this.state.selectedMap === 'amap') {
      await addMarkersToAMap(privatePhotos);
    }

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

  setMap = (name: string) => {
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
            selectedMap === GOOGLE_MAP ? 'show' : 'hide'
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
            selectedMap === A_MAP ? 'show' : 'hide'
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
            selectedMap === BAIDU_MAP ? 'show' : 'hide'
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
      <div className='map-wrapper'>
        <Message message={message} />
        {this.renderMap2()}
        <div className='menu-btn-wrapper'>
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

interface MapState {
  folders: PhotoFolder[];
  /** key 是 `${lat},${lng}`，value 是百度坐标；见 BaiduMap/types.ts */
  gpsBMapPointsMapping: GpsBMapPointsMapping;
  amapLoaded: boolean;
  message: string;
  selectedMap: string;
}