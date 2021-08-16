import React from "react";
import { Radio } from "antd";
import debugModule from "debug";
import get from "lodash.get";

const debug = debugModule("photo-map:src/Application/MapSelector.jsx");

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};

export default function MapSelector(props) {
  debug("render()");

  const { selectedMap } = props;

  const handleChange = (event) => {
    const { value } = event.target;
    props.onChange && props.onChange(value);
  };

  return (
    <div className="map-selector">
      <h3>Choose Map:</h3>
      <Radio.Group onChange={handleChange} value={selectedMap}>
        <Radio style={radioStyle} value="amap">
          AMap ({get(window, "AMap.v")})
        </Radio>
        <Radio style={radioStyle} value="google">
          Google Maps
        </Radio>
      </Radio.Group>
    </div>
  );
}
