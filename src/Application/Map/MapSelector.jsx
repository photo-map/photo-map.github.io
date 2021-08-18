import React from "react";
import { Radio } from "antd";
import debugModule from "debug";
import get from "lodash.get";

import { GOOGLE_MAP, A_MAP, BAIDU_MAP } from "../constants";

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
    props.onChange && props.onChange(event.target.value);
  };

  return (
    <div className="map-selector">
      <h3>Choose Map:</h3>
      <Radio.Group onChange={handleChange} value={selectedMap}>
        <Radio style={radioStyle} value={A_MAP}>
          AMap ({get(window, "AMap.v")})
        </Radio>
        <Radio style={radioStyle} value={BAIDU_MAP}>
          Baidu Map ({get(window, "BMapGL.version")})
        </Radio>
        <Radio style={radioStyle} value={GOOGLE_MAP}>
          Google Maps
        </Radio>
      </Radio.Group>
    </div>
  );
}
