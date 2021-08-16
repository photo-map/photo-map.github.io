import React, { Component } from "react";
import { Map } from "react-amap";
import PubSub from "pubsub-js";
import debugModule from "debug";

import { FIT_MARKERS_TOPIC } from "../";
import { getMarkersInFolder } from "./helpers";

import "./index.css";

const debug = debugModule("photo-map:src/Application/Map/AMap/index.jsx");

export const ADD_MARKERS_TOPIC = "amap.addmarkers";
export const REMOVE_ALL_MARKERS_TOPIC = "amap.removeallmarkers";
export const REMOVE_MARKERS_IN_FOLDER_TOPIC = "amap.removemarkersinfolder";
export const SHOW_MARKERS_TOPIC = "amap.showmarkers"; // TODO duplicated with src/Application/Map/index.jsx
export const HIDE_MARKERS_TOPIC = "amap.hidemarkers"; // TODO duplicated with src/Application/Map/index.jsx

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
export default class AMap extends Component {
  // AMap instance
  map = null;
  // An array of AMap.Marker instances
  allMarkers = [];

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

  addMarkersSubscriber = (msg, data) => {
    this.addMarkers(data.files, data.visible, data.folderId);
  };

  removeMarkersInFolderSubscriber = (msg, data) => {
    this.removeMarkersInFolder(data.folderId);
  };

  removeAllMarkersSubscriber = (msg) => {
    this.removeAllMarkers();
  };

  showMarkersSubscriber = (msg, filter) => {
    this.updateMarkersInFolderVisible(filter.folderId, true);
  };

  hideMarkersSubscriber = (msg, filter) => {
    this.updateMarkersInFolderVisible(filter.folderId, false);
  };

  fitMarkersSubscriber = (msg) => {
    if (!this.map) {
      console.error("this.map of AMap is undefined!");
      return;
    }

    // Fitbounds to all the markers
    this.map.setFitView();
  };

  updateMarkersInFolderVisible = (folderId, visible) => {
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

  genMarker = (photo, folderId, visible) =>
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

  addMarkers = (files, visible = true, folderId) => {
    if (!window.AMap) {
      alert(
        "We are about to convert location from GPS to AMap, but AMap still not loaded!"
      );
      return;
    }

    const lnglats = [];
    files.forEach((file) => {
      lnglats.push([
        file.imageMediaMetadata.location.longitude,
        file.imageMediaMetadata.location.latitude,
      ]);
    });

    debug("window.AMap.convertFrom() loading");
    window.AMap.convertFrom(lnglats, "gps", (status, result) => {
      debug("window.AMap.convertFrom", status, result);

      if (result.info === "ok") {
        const photos = result.locations.map((resLnglat, index) => {
          // resLnglat={Q: 39.877753363716
          // R: 116.21148084852501
          // lat: 39.877753
          // lng: 116.211481}
          return {
            lnglat: resLnglat,
            thumbnail: files[index].thumbnailLink,
            webViewLink: files[index].webViewLink,
          };
        });

        photos.forEach((photo) => {
          const marker = this.genMarker(photo, folderId, visible);
          marker.content = `<div><a target="_blank" href="${photo.webViewLink}"><img src="${photo.thumbnail}"></a></div>`;
          this.allMarkers.push(marker);
          const markerClick = (event) => {
            var infoWindow = new window.AMap.InfoWindow({
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

  removeMarkersInFolder = (folderId) => {
    const markersInFolder = [];
    const markers = this.map.getAllOverlays("marker");
    markers.forEach((marker) => {
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
      created: (instance) => {
        this.props.onMapInstanceCreated(instance);
        this.map = instance;
      },
      /**
       * @param {MapsEvent} mapsEvent
       */
      click: (mapsEvent) => {
        debug("AMap event: click", mapsEvent);
        // @type {LngLat} https://lbs.amap.com/api/javascript-api/reference/core#LngLat
        const lngLat = mapsEvent.lnglat;
        console.log(`You click on the AMap, lngLat: ${lngLat.toString()}`);
      },
    };

    const layers = [];
    if (window.AMap) {
      layers.push(new window.AMap.TileLayer.Satellite());
    }

    // Add onInstanceCreated prop to <Map> will cause events.created not fired.
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
