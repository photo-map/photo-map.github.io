import { Component } from "react";
import { Map } from "react-amap";
import PubSub from "pubsub-js";
import debugModule from "debug";

import { FIT_MARKERS_TOPIC } from "../constants";
import { getMarkersInFolder } from "./helpers";
import {
  SHOW_MARKERS_TOPIC,
  HIDE_MARKERS_TOPIC,
  REMOVE_MARKERS_IN_FOLDER_TOPIC,
} from "./constants";
import type { DriveFile, PhotoFolder } from "../../types";

import "./index.css";

const debug = debugModule("photo-map:src/Application/Map/AMap/index.tsx");

export const ADD_MARKERS_TOPIC = "amap.addmarkers";
export const REMOVE_ALL_MARKERS_TOPIC = "amap.removeallmarkers";

/** 由 convertFrom 转换后的一张照片（供 genMarker 落图用） */
interface Photo {
  lnglat: any;
  thumbnail: string | undefined;
  webViewLink: string | undefined;
}

interface AMapProps {
  defaultCenter: { latitude: number; longitude: number };
  defaultZoom: number;
  onMapInstanceCreated: (map: any) => void;
}

/**
 * AMap
 * @export
 * @class AMap
 * @extends {Component}
 *
 * How to use AMap API
 * ```js
 * const {map} = this.aMapRef.current
 * // map.getAllOverlays()
 * // map.setFitView()
 * ```
 * window.AMap is init in original amap lib
 */
export default class AMap extends Component<AMapProps> {
  // AMap instance；window.AMap 为 any（见 src/globals.d.ts），实例同样按 any 处理
  map: any = null;
  // An array of AMap.Marker instances
  allMarkers: any[] = [];

  // PubSub.subscribe() 返回的 token，在 addSubscribers()（componentDidMount 中）赋值
  private addMarkersToken!: string;
  private removeAllMarkersToken!: string;
  private removeMarkersInFolderToken!: string;
  private showMarkersToken!: string;
  private hideMarkersToken!: string;
  private fitMarkersToken!: string;

  componentDidMount() {
    this.addSubscribers();
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  addSubscribers = () => {
    this.addMarkersToken = PubSub.subscribe(
      ADD_MARKERS_TOPIC,
      this.addMarkersSubscriber
    );
    this.removeAllMarkersToken = PubSub.subscribe(
      REMOVE_ALL_MARKERS_TOPIC,
      this.removeAllMarkersSubscriber
    );
    this.removeMarkersInFolderToken = PubSub.subscribe(
      REMOVE_MARKERS_IN_FOLDER_TOPIC,
      this.removeMarkersInFolderSubscriber
    );
    this.showMarkersToken = PubSub.subscribe(
      SHOW_MARKERS_TOPIC,
      this.showMarkersSubscriber
    );
    this.hideMarkersToken = PubSub.subscribe(
      HIDE_MARKERS_TOPIC,
      this.hideMarkersSubscriber
    );
    this.fitMarkersToken = PubSub.subscribe(
      FIT_MARKERS_TOPIC,
      this.fitMarkersSubscriber
    );
  };

  removeSubscribers = () => {
    PubSub.unsubscribe(this.addMarkersToken);
    PubSub.unsubscribe(this.removeAllMarkersToken);
    PubSub.unsubscribe(this.removeMarkersInFolderToken);
    PubSub.unsubscribe(this.showMarkersToken);
    PubSub.unsubscribe(this.hideMarkersToken);
  };

  addMarkersSubscriber = (msg: any, data: PhotoFolder) => {
    this.addMarkers(data.files, data.visible, data.folderId);
  };

  removeMarkersInFolderSubscriber = (msg: any, data: { folderId: string }) => {
    this.removeMarkersInFolder(data.folderId);
  };

  removeAllMarkersSubscriber = (msg: any) => {
    this.removeAllMarkers();
  };

  showMarkersSubscriber = (msg: any, filter: { folderId: string }) => {
    this.updateMarkersInFolderVisible(filter.folderId, true);
  };

  hideMarkersSubscriber = (msg: any, filter: { folderId: string }) => {
    this.updateMarkersInFolderVisible(filter.folderId, false);
  };

  fitMarkersSubscriber = (msg: any) => {
    if (!this.map) {
      console.error("this.map of AMap is undefined!");
      return;
    }

    // Fitbounds to all the markers
    this.map.setFitView();
  };

  updateMarkersInFolderVisible = (folderId: string, visible: boolean) => {
    getMarkersInFolder(this.map, folderId).forEach((marker) => {
      if (visible) {
        marker.show();
      } else {
        marker.hide();
      }
    });

    // Fitbounds to all the markers
    this.map.setFitView();
  };

  genMarker = (photo: Photo, folderId: string | undefined, visible: boolean) =>
    new window.AMap.Marker({
      map: this.map,
      visible,
      position: photo.lnglat,
      icon: new window.AMap.Icon({
        // width/height used in <div> tag which wraps the <img> tag
        size: new window.AMap.Size(64, 64),
        image: photo.thumbnail,
        // width/height used in <img> tag
        imageSize: new window.AMap.Size(64, 64),
        // 图标取图偏移量
        // imageOffset: new AMap.Pixel(-9, -3)
      }),

      // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
      // offset: new AMap.Pixel(-13, -30)

      extData: {
        // folderId="__privateFolderId__" // private folder, because this id will change, we will not use this id
        // folderId="13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr" // public folder
        folderId,
      },
    });

  addMarkers = (files: DriveFile[], visible = true, folderId?: string) => {
    if (!window.AMap) {
      alert(
        "We are about to convert location from GPS to AMap, but AMap still not loaded!"
      );
      return;
    }

    // 跳过无 GPS 的照片（用户确认，2026-10-10；与 BaiduMap/helpers 的决策一致）。
    // 原 JS 无条件访问 imageMediaMetadata.location，无 GPS 照片会抛错并中断整个加载流程。
    const filesWithGps = files.filter(
      (file) => file.imageMediaMetadata?.location
    );

    const lnglats: number[][] = [];
    filesWithGps.forEach((file) => {
      lnglats.push([
        file.imageMediaMetadata!.location!.longitude,
        file.imageMediaMetadata!.location!.latitude,
      ]);
    });

    debug("window.AMap.convertFrom() loading");
    window.AMap.convertFrom(lnglats, "gps", (status: any, result: any) => {
      debug("window.AMap.convertFrom", status, result);

      if (result.info === "ok") {
        const photos = result.locations.map((resLnglat: any, index: number) => {
          // resLnglat={Q: 39.877753363716
          // R: 116.21148084852501
          // lat: 39.877753
          // lng: 116.211481}
          return {
            lnglat: resLnglat,
            // 注意：必须与 filesWithGps 对齐（跳过的照片已从 files 中滤掉）
            thumbnail: filesWithGps[index].thumbnailLink,
            webViewLink: filesWithGps[index].webViewLink,
          };
        });

        photos.forEach((photo: Photo) => {
          const marker = this.genMarker(photo, folderId, visible);
          marker.content = `<div><a target="_blank" href="${photo.webViewLink}"><img src="${photo.thumbnail}"></a></div>`;
          this.allMarkers.push(marker);
          const markerClick = (event: any) => {
            const infoWindow = new window.AMap.InfoWindow({
              offset: new window.AMap.Pixel(0, -30),
            });
            infoWindow.setContent(event.target.content);
            infoWindow.open(this.map, event.target.getPosition());
          };
          marker.on("click", markerClick);
        });

        // Fitbounds to all the markers
        this.map.setFitView();
      }
    });
  };

  removeMarkersInFolder = (folderId: string) => {
    const markersInFolder: any[] = [];
    const markers = this.map.getAllOverlays("marker");
    markers.forEach((marker: any) => {
      if (marker.getExtData().folderId === folderId) {
        markersInFolder.push(marker);
      }
    });
    this.map.remove(markersInFolder);
  };

  removeAllMarkers = () => {
    this.map.remove(this.allMarkers);
  };

  render() {
    const { defaultCenter, defaultZoom } = this.props;

    const events = {
      created: (instance: any) => {
        this.props.onMapInstanceCreated(instance);
        this.map = instance;
      },
      /**
       * @param {MapsEvent} mapsEvent
       */
      click: (mapsEvent: any) => {
        debug("AMap event: click", mapsEvent);
        // @type {LngLat} https://lbs.amap.com/api/javascript-api/reference/core#LngLat
        const lngLat = mapsEvent.lnglat;
        console.log(`You click on the AMap, lngLat: ${lngLat.toString()}`);
      },
    };

    const layers = [];
    if (window.AMap) {
      // https://lbs.amap.com/demo/jsapi-v2/example/layers/satellite/
      layers.push(new window.AMap.TileLayer.Satellite());
    }

    // Add onInstanceCreated prop to <Map> will cause events.created not fired.
    // props definitions of Map component: https://elemefe.github.io/react-amap/components/map#%E5%B1%9E%E6%80%A7%E5%88%97%E8%A1%A8
    return (
      <div className="amap-wrapper">
        <Map
          amapkey={process.env.REACT_APP_AMAP_API_KEY}
          version="1.4.15"
          center={defaultCenter}
          zoom={defaultZoom}
          layers={layers}
          events={events}
        />
      </div>
    );
  }
}
