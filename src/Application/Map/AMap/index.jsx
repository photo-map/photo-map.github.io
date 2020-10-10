import React, { Component } from "react";
import { Map } from "react-amap";
import PubSub from "pubsub-js";
import debugModule from "debug";

import "./index.css";

const debug = debugModule("photo-map:src/Application/Map/AMap/index.jsx");

export const ADD_MARKERS_TOPIC = "amap.addmarkers";
export const REMOVE_MARKERS_TOPIC = "amap.removemarkers";
export const SHOW_MARKERS_TOPIC = "amap.showmarkers";
export const HIDE_MARKERS_TOPIC = "amap.hidemarkers";

export const PRIVATE_FOLDER_ID = "__privateFolderId__";

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
 */
export default class AMap extends Component {
  // AMap instance
  map = null;
  aMapMarkers = [];

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
    this.removeMarkersToken = PubSub.subscribe(
      REMOVE_MARKERS_TOPIC,
      this.removeMarkersSubscriber
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
    PubSub.unsubscribe(this.addMarkersToken);
    PubSub.unsubscribe(this.removeMarkersToken);
  };

  addMarkersSubscriber = (msg, data) => {
    this.addMarkers(data.files, data.visible, data.folderId);
  };

  removeMarkersSubscriber = (msg) => {
    this.removeMarkers();
  };

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

        photos.forEach((photo, index) => {
          const marker = new window.AMap.Marker({
            map: this.map,
            visible,
            position: photo.lnglat,
            icon: new window.AMap.Icon({
              // width/height used in <div> tag which wraps the <img> tag
              size: new window.AMap.Size(51, 52),
              image: photo.thumbnail,
              // width/height used in <img> tag
              imageSize: new window.AMap.Size(53, 54),
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
          marker.content = `<div><a target="_blank" href="${photo.webViewLink}"><img src="${photo.thumbnail}"></a></div>`;
          this.aMapMarkers.push(marker);
          const markerClick = (event) => {
            var infoWindow = new window.AMap.InfoWindow({
              offset: new window.AMap.Pixel(0, -30),
            });
            infoWindow.setContent(event.target.content);
            infoWindow.open(this.map, event.target.getPosition());
          };
          marker.on("click", markerClick);
        });

        this.map.setFitView();
      }
    });
  };

  removeMarkers = () => {
    this.map.remove(this.aMapMarkers);
  };

  showMarkersSubscriber = (msg, filter) => {
    const markers = this.map.getAllOverlays("marker");
    markers.forEach((marker) => {
      if (marker.getExtData().folderId === filter.folderId) {
        marker.show();
      }
    });
    this.map.setFitView();
  };

  hideMarkersSubscriber = (msg, filter) => {
    const markers = this.map.getAllOverlays("marker");
    markers.forEach((marker) => {
      if (marker.getExtData().folderId === filter.folderId) {
        marker.hide();
      }
    });
    this.map.setFitView();
  };

  render() {
    debug("render()", this.props);
    const { defaultCenter, defaultZoom } = this.props;

    const events = {
      created: (instance) => {
        this.props.onMapInstanceCreated(instance);
        this.map = instance;
      },
      click: () => {
        debug("AMap event: click");
      },
    };

    // Add onInstanceCreated prop to <Map> will cause events.created not fired.
    return (
      <div className="amap-wrapper">
        <Map
          amapkey={process.env.REACT_APP_AMAP_API_KEY}
          version="1.4.15"
          center={defaultCenter}
          zoom={defaultZoom}
          events={events}
        />
      </div>
    );
  }
}
