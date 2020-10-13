import React from "react";
import { GoogleMap } from "react-google-maps";

const GoogleMapWrapper = (props) => (
  <GoogleMap
    defaultZoom={props.defaultZoom}
    defaultCenter={props.defaultCenter}
    onClick={
      /**
       * https://developers.google.com/maps/documentation/javascript/reference/map#Map.click
       * @param {MouseEvent} event https://developers.google.com/maps/documentation/javascript/reference/map#MouseEvent
       */
      (event) => {
        // @type {google.maps.LatLng} https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
        const { latLng } = event;
        console.log(
          `You click on the Google Maps, latLng: ${latLng.toString()}`
        );
      }
    }
  >
    {props.children}
  </GoogleMap>
);

export default GoogleMapWrapper;
