import React, { useState } from "react";
import debugModule from "debug";

const debug = debugModule("photo-map:src/Application/MapSelector.jsx");

export default function MapSelector(props) {
  debug("render()");

  const [selectedMap, setSelectedMap] = useState("amap");

  const handleChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedMap(name);
      props.onChange && props.onChange(name);
    }
  };

  return (
    <div className="map-selector">
      <input
        type="radio"
        name="amap"
        checked={selectedMap === "amap"}
        onChange={handleChange}
      />
      <label>AMap</label>
      <br />
      <input
        type="radio"
        name="google"
        checked={selectedMap === "google"}
        onChange={handleChange}
      />
      <label>Google Maps</label>
      <br />
    </div>
  );
}
