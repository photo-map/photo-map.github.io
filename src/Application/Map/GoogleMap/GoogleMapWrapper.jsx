import React from "react";
import { GoogleMap } from "react-google-maps";

/**
 * google.maps.LatLng
 * @typedef {Object} LatLng
 */

/**
 * This object is returned from various mouse events on the map and overlays, and contains all the fields shown below.
 * Checkout the {@link https://developers.google.com/maps/documentation/javascript/reference/map#MouseEvent API document}
 * @typedef {Object} MouseEvent
 * @property {LatLng} latLng
 */

/**
 * Checkout the {@link https://developers.google.com/maps/documentation/javascript/reference/map#Map.click API document} for this "click" event
 * @param {MouseEvent} event
 */
function handleClick(event) {
  // @type {LatLng} https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
  const { latLng } = event;
  console.log(`You click on the Google Maps, latLng: ${latLng.toString()}`);
}

const GoogleMapWrapper = (props) => (
  <GoogleMap
    defaultZoom={props.defaultZoom}
    defaultCenter={props.defaultCenter}
    mapTypeId="satellite"
    onClick={handleClick}
  >
    {props.children}
  </GoogleMap>
);

export default GoogleMapWrapper;
