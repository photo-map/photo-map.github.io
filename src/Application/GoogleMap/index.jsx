import React from "react";
import { Marker } from "react-google-maps";

import GoogleMapWrapper from "./GoogleMapWrapper";
import GoogleMapCompose from "./GoogleMapCompose";
import PhotoMarker from "./PhotoMarker";
import { photoMarker, photoMarker2 } from "../markers.jsx";

const GoogleMapComponent = GoogleMapCompose(GoogleMapWrapper);

function GoogleMap(props) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return <div>Please fill your Google Maps API key in .env file</div>;
  }

  return (
    <GoogleMapComponent
      apiKey={apiKey}
      defaultZoom={props.defaultZoom}
      defaultCenter={props.defaultCenter}
      isMarkerShown={props.isMarkerShown}
      onMarkerClick={props.onMarkerClick}
    >
      {props.markers.map(({ ...markerProps }, index) => {
        return <Marker key={index} {...markerProps}></Marker>;
      })}
      <PhotoMarker {...photoMarker} />
      <PhotoMarker {...photoMarker2} />
    </GoogleMapComponent>
  );
}

export default GoogleMap;
