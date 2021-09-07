import React from "react";
import GoogleMapReact from "google-map-react";
import { message } from "antd";
import PubSub from "pubsub-js";
import debugModule from "debug";

import { FIT_MARKERS_TOPIC } from "Application/Map/constants";
import { fitGoogleMapMarkers, file2Marker } from "../helpers";
import {
  locationGetFromGoogleMap,
  locationGetFromSateliteImage,
} from "../constants";

const debug = debugModule(
  "photo-map:src/Application/Map/GoogleMap/GoogleMapReact/index.jsx"
);

export default class GoogleMapReactWrapper extends React.Component {
  componentDidMount() {
    this.addSubscribers();
  }

  componentWillUnmount() {
    this.removeSubscribers();
  }

  handleApiLoaded = ({ map, maps }) => {
    debug("handleApiLoaded()", map, maps);
    this.map = map;
    this.maps = maps;

    fitGoogleMapMarkers(map, this.props.folders);

    this.renderPhotoMarkers();
    this.renderOffsetMarkers();
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
    if (!this.map) {
      message.error("map not mounted!");
      return;
    }

    const markers = [];
    this.props.folders.forEach((folder) => {
      if (folder.visible === false) return;
      folder.files.forEach((file) => {
        const data = file2Marker(file);
        let marker = new this.maps.Marker({
          ...data,
          map: this.map,
          // title: 'Hello World!'
        });
        markers.push(marker);
      });
    });
  };

  renderOffsetMarkers = () => {
    new this.maps.Marker({
      position: locationGetFromGoogleMap,
      map: this.map,
      label: "Map",
    });
    new this.maps.Marker({
      position: locationGetFromSateliteImage,
      map: this.map,
      label: "Satelite",
    });
  };

  render() {
    // https://github.com/google-map-react/google-map-react
    return (
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
          defaultCenter={this.props.defaultCenter}
          defaultZoom={this.props.defaultZoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={this.handleApiLoaded}
        ></GoogleMapReact>
      </div>
    );
  }
}
