import React from "react";
import { Marker } from "react-google-maps";

import GoogleMapWrapper from "./GoogleMapWrapper";
import GoogleMapCompose from "./GoogleMapCompose";
import PhotoMarker from "./PhotoMarker";
import { photoMarker, photoMarker2 } from "../markers.jsx";

const GoogleMapComponent = GoogleMapCompose(GoogleMapWrapper);

function GoogleMap(props) {
  return (
    <GoogleMapComponent
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
                height: 50,
                width: 50,
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

export default GoogleMap;
