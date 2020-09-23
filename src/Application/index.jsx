import React, { useState, useEffect } from "react";

import GoogleMap from "./GoogleMap";
import { simpleMarker } from "./markers";
import AMap from "./AMap";
import "./index.css";
import MapSelector from "./MapSelector";

const center2 = { latitude: 39.871446, longitude: 116.215768 };
const center = { lat: 39.871446, lng: 116.215768 };

export default function Application(props) {
  const [isMarkerShown, setIsMarkerShown] = useState(false);
  const [selectedMap, setSelectedMap] = useState("amap");

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
    console.log("mount it!");
    delayedShowMarker();
  }, []);

  const showAMap = selectedMap === "amap";

  return (
    <div className="application">
      <MapSelector onChange={(name) => setSelectedMap(name)} />
      {showAMap ? (
        <AMap defaultCenter={center2} />
      ) : (
        <GoogleMap
          isMarkerShown={isMarkerShown}
          defaultZoom={16}
          defaultCenter={center}
          markers={[simpleMarker]}
          onMarkerClick={handleMarkerClick}
        />
      )}
    </div>
  );
}
