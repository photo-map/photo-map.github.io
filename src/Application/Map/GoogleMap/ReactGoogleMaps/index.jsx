import React, { Component } from "react";
import { Marker } from "react-google-maps";
import PubSub from "pubsub-js";
import debugModule from "debug";

import { FIT_MARKERS_TOPIC } from "../../constants";
import GoogleMapWrapper from "./GoogleMapWrapper";
import GoogleMapCompose from "./GoogleMapCompose";
import PhotoMarker from "./PhotoMarker";
import { fitGoogleMapMarkers } from "./helpers";
// import { photoMarker, photoMarker2 } from "../markers.jsx";

const debug = debugModule("photo-map:src/Application/Map/GoogleMap/index.jsx");
const GoogleMapComponent = GoogleMapCompose(GoogleMapWrapper);

const locationGetFromGoogleMap = {
  lat: 39.873806,
  lng: 116.22555,
};
const locationGetFromSateliteImage = {
  lat: 39.872542,
  lng: 116.219536,
};
// const latOffset =locationGetFromGoogleMap.lat-locationGetFromSateliteImage.lat
// const lngOffset =locationGetFromGoogleMap.lng-locationGetFromSateliteImage.lng

/**
 * Marker - https://developers.google.com/maps/documentation/javascript/markers
 *
 * @param {*} props
 * @returns
 */
// function GoogleMap(props) {

// }
class GoogleMap extends Component {
  componentDidMount() {
    this.addSubscribers();
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  handleMapMounted = (map) => {
    debug("handleMapMounted()", map);
    this.map = map;

    fitGoogleMapMarkers(map, this.props.folders);
  };

  handleMapUnmounted = () => {
    debug("handleMapUnmounted()");
  };

  fitMarkersSubscriber = (msg) => {
    debug("fitMarkersSubscriber()", msg);

    if (!this.map) {
      console.error("this.map of Google Map is undefined!");
      return;
    }

    fitGoogleMapMarkers(this.map, this.props.folders);
  };

  addSubscribers = () => {
    this.fitMarkersToken = PubSub.subscribe(
      FIT_MARKERS_TOPIC,
      this.fitMarkersSubscriber
    );
  };

  removeSubscribers = () => {
    PubSub.unsubscribe(this.fitMarkersToken);
  };

  renderPhotoMarkers = () => {
    const markers = [];
    this.props.folders.forEach((folder) => {
      if (folder.visible === false) return;
      folder.files.forEach((file) => {
        const icon = {
          anchor: { x: 0, y: 0 },
          labelOrigin: { x: 0, y: 0 },
          // origin: {x:0,y:0},
          scaledSize: {
            // img size
            height: 64,
            width: 64,
          },
          // size: { // div size
          //   height: 100,
          //   width: 200,
          // },
          url: file.thumbnailLink,
        }; /* Icon */
        markers.push(
          <PhotoMarker
            key={JSON.stringify(file)}
            position={
              {
                lat: file.imageMediaMetadata.location.latitude,
                lng: file.imageMediaMetadata.location.longitude,
              } /* LatLngLiteral */
            }
            icon={icon}
          />
        );
      });
    });
    return markers;
  };

  render() {
    debug("render()", this.props);
    const { defaultZoom, defaultCenter, markers } = this.props;

    return (
      <GoogleMapComponent
        ref={this.mapRef}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        onMapMounted={this.handleMapMounted}
        onMapUnmounted={this.handleMapUnmounted}
      >
        {markers.map(({ ...markerProps }, index) => {
          return <Marker key={index} {...markerProps}></Marker>;
        })}
        <Marker label="Map" position={locationGetFromGoogleMap} />
        <Marker label="Satelite" position={locationGetFromSateliteImage} />
        {/*<PhotoMarker {...photoMarker} />
      <PhotoMarker {...photoMarker2} />*/}
        {this.renderPhotoMarkers()}
      </GoogleMapComponent>
    );
  }
}

export default GoogleMap;
