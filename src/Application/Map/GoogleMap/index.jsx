import React, { Component } from "react";
import { Marker } from "react-google-maps";
import PubSub from "pubsub-js";

import GoogleMapWrapper from "./GoogleMapWrapper";
import GoogleMapCompose from "./GoogleMapCompose";
import PhotoMarker from "./PhotoMarker";
// import { photoMarker, photoMarker2 } from "../markers.jsx";

const GoogleMapComponent = GoogleMapCompose(GoogleMapWrapper);
export const FIT_MARKERS_TOPIC = "googlemap.fitmarkers";

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
    this.map = map;
  };

  fitMarkersSubscriber = (msg) => {
    if (!this.map) {
      console.error("this.map is undefined!");
      return;
    }

    // @type {google.maps.LatLngBounds} https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
    var bounds = new window.google.maps.LatLngBounds();

    this.props.files.forEach((file) => {
      // extend(point), point is type of LatLng
      bounds.extend({
        lat: file.imageMediaMetadata.location.latitude,
        lng: file.imageMediaMetadata.location.longitude,
      });
    });

    this.map.fitBounds(bounds);
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

  render() {
    const props = this.props;

    return (
      <GoogleMapComponent
        ref={this.mapRef}
        defaultZoom={props.defaultZoom}
        defaultCenter={props.defaultCenter}
        onMapMounted={this.handleMapMounted}
      >
        {props.markers.map(({ ...markerProps }, index) => {
          return <Marker key={index} {...markerProps}></Marker>;
        })}
        <Marker label="Map" position={locationGetFromGoogleMap} />
        <Marker label="Satelite" position={locationGetFromSateliteImage} />
        {/*<PhotoMarker {...photoMarker} />
      <PhotoMarker {...photoMarker2} />*/}
        {props.files.map((file) => (
          <PhotoMarker
            key={JSON.stringify(file)}
            position={
              {
                lat: file.imageMediaMetadata.location.latitude,
                lng: file.imageMediaMetadata.location.longitude,
              } /* LatLngLiteral */
            }
            icon={
              {
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
              } /* Icon */
            }
          />
        ))}
      </GoogleMapComponent>
    );
  }
}

export default GoogleMap;
