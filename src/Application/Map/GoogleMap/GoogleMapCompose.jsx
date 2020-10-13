import React from "react";
import { compose, withProps, withHandlers } from "recompose";
import { withScriptjs, withGoogleMap } from "react-google-maps";

const GoogleMapCompose = compose(
  withProps((ownerProps) => ({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: "100%" }} />,
    containerElement: <div style={{ height: "100vh" }} />,
    mapElement: <div style={{ height: "100%" }} />,
  })),
  withHandlers((ownerProps) => {
    const refs = {
      map: undefined,
    };

    return {
      onMapMounted: () => (ref) => {
        refs.map = ref;
        ownerProps.onMapMounted(ref);
      },
      // onZoomChanged: ({ onZoomChange }) => () => {
      //   onZoomChange(refs.map.getZoom())
      // }
    };
  }),
  withScriptjs,
  withGoogleMap
);

export default GoogleMapCompose;
