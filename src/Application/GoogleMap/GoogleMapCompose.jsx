import React from "react";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap } from "react-google-maps";

const GoogleMapCompose = compose(
  withProps((ownerProps) => ({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${ownerProps.apiKey}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: "100%" }} />,
    containerElement: <div style={{ height: "100vh" }} />,
    mapElement: <div style={{ height: "100%" }} />,
  })),
  withScriptjs,
  withGoogleMap
);

export default GoogleMapCompose;
