import React from "react";
import { GoogleMap } from "react-google-maps";

const GoogleMapWrapper = (props) => (
  <GoogleMap
    defaultZoom={props.defaultZoom}
    defaultCenter={props.defaultCenter}
  >
    {props.children}
  </GoogleMap>
);

export default GoogleMapWrapper;
