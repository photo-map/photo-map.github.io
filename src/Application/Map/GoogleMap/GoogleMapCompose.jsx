import React from "react";
import { compose, withProps, withHandlers } from "recompose";
import { withScriptjs, withGoogleMap } from "react-google-maps";
import debugModule from "debug";

const debug = debugModule(
  "photo-map:src/Application/Map/GoogleMap/GoogleMapCompose.jsx"
);

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
      /**
       * React will call the `ref` callback with the DOM element when the component mounts,
       * and call it with `null` when it unmounts.
       * @see https://reactjs.org/docs/refs-and-the-dom.html
       */
      refCallback: () => (ref) => {
        debug("refCallback()()", ref);
        refs.map = ref;

        if (ref === null) {
          ownerProps.onMapUnmounted();
          return;
        }
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
