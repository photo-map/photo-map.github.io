import React from "react";
import PropTypes from "prop-types";
import { Map, Marker, NavigationControl } from "react-bmapgl";
import ZoomControl from "react-bmapgl/Control/ZoomControl";

import { folderType } from "../typedef";
import { fitBMapMarkers } from "./helpers";

export default class BaiduMap extends React.Component {
  // baidu map, will be null when baidu map unmounts
  map = null;

  // Will be called when map component unmounts
  handleMapComponentMountOrUmount = (ref) => {
    if (ref === null) {
      console.log("baidu map component unmounts");
      this.map = null;
      return;
    }
    this.map = ref.map;
  };

  renderPhotoMarkers = () => {
    const markers = [];
    this.props.folders.forEach((folder, folderIndex) => {
      if (folder.visible === false) return;
      folder.files.forEach((file, fileIndex) => {
        const { location } = file.imageMediaMetadata;
        const bMapPoint =
          this.props.gpsBMapPointsMapping[
            `${location.latitude},${location.longitude}`
          ];
        if (!bMapPoint) {
          console.warn(
            "bMapPoint not found in gpsBMapPointsMapping, location:",
            location
          );
          return;
        }
        // https://lbsyun.baidu.com/index.php?title=jspopularGL/guide/addOverlay
        const icon = new window.BMapGL.Icon(
          file.thumbnailLink,
          // original thumnbail photo size 220x183
          new window.BMapGL.Size(64, 64),
          {
            // // 指定定位位置。
            // // 当标注显示在地图上时，其所指向的地理位置距离图标左上
            // // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
            // // 图标中央下端的尖角位置。
            // anchor: new BMapGL.Size(10, 25),
            // // 设置图片偏移。
            // // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
            // // 需要指定大图的偏移位置，此做法与css sprites技术类似。
            // imageOffset: new BMapGL.Size(0, 0 - 25), // 设置图片偏移
          }
        );
        markers.push(
          <Marker
            key={`folder-${folderIndex}-file-${fileIndex}`}
            position={bMapPoint}
            icon={icon}
          />
        );
      });
    });
    return markers;
  };

  render() {
    fitBMapMarkers(this.map, this.props.folders);
    // Map props definition: https://lbsyun.baidu.com/solutions/reactBmapDoc
    // More methods and properties of Map: https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html
    return (
      <Map
        ref={this.handleMapComponentMounted}
        style={{ height: "100vh", width: "100%" }}
        center={this.props.defaultCenter}
        zoom={this.props.defaultZoom}
      >
        <NavigationControl />
        <ZoomControl />
        {this.renderPhotoMarkers()}
        {/*<Marker position={{ lng: 116.402544, lat: 39.928216 }} />
        <InfoWindow
          position={{ lng: 116.402544, lat: 39.928216 }}
          text="内容"
          title="标题"
        />*/}
      </Map>
    );
  }
}

BaiduMap.propTypes = {
  defaultCenter: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }), // BMap.Point
  defaultZoom: PropTypes.number.isRequired,
  folders: PropTypes.arrayOf(folderType).isRequired,
};
