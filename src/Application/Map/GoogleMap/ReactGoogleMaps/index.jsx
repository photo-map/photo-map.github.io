import React, { Component } from "react";
import { Marker } from "react-google-maps";
import PubSub from "pubsub-js";
import debugModule from "debug";

import { FIT_MARKERS_TOPIC } from "Application/Map/constants";
import GoogleMapWrapper from "./GoogleMapWrapper";
import GoogleMapCompose from "./GoogleMapCompose";
import PhotoMarker from "./PhotoMarker";
import { fitGoogleMapMarkers, file2Marker } from "../helpers";
import {
  locationGetFromGoogleMap,
  locationGetFromSateliteImage,
} from "../constants";
// import { photoMarker, photoMarker2 } from "../markers.jsx";

const debug = debugModule(
  "photo-map:src/Application/Map/GoogleMap/ReactGoogleMaps/index.jsx"
);
const GoogleMapComponent = GoogleMapCompose(GoogleMapWrapper);

/**
 * Marker - https://developers.google.com/maps/documentation/javascript/markers
 *
 * @param {*} props
 * @returns
 */
// function ReactGoogleMapsWrapper(props) {

// }
export default class ReactGoogleMapsWrapper extends Component {
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
        const data = file2Marker(file);
        markers.push(<PhotoMarker key={JSON.stringify(file)} data={data} />);
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
