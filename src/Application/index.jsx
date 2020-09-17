import React, { useState, useEffect } from "react";

import GoogleMap from "./GoogleMap";
import { simpleMarker } from "./markers";

function Application(props) {
  const [isMarkerShown, setIsMarkerShown] = useState(false);

  const delayedShowMarker = () => {
    setTimeout(() => {
      setIsMarkerShown(true);
    }, 1000);
  };

  const handleMarkerClick = () => {
    setIsMarkerShown(false);
    delayedShowMarker();
  };

  useEffect(() => {
    delayedShowMarker();
    console.log("mount it!");
  }, []);

  return (
    <div className="Application">
      <GoogleMap
        isMarkerShown={isMarkerShown}
        defaultZoom={16}
        defaultCenter={{ lat: 39.871446, lng: 116.215768 }}
        markers={[simpleMarker]}
        onMarkerClick={handleMarkerClick}
      ></GoogleMap>
    </div>
  );
}

export default Application;
