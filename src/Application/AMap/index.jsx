import React from "react";
import { Map, Marker } from "react-amap";

import photo from "../assets/lair_white_worm_blb_librivox.jpeg";

function AMap(props) {
  const { defaultCenter } = props;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <p>
        process.env.REACT_APP_AMAP_API_KEY:{process.env.REACT_APP_AMAP_API_KEY}
      </p>
      <p>process.env.REACT_APP_DEVIN:{process.env.REACT_APP_DEVIN}</p>
      <p>process.env.DEVIN2:{process.env.DEVIN2}</p>
      <p>process.env.NODE_ENV:{process.env.NODE_ENV}</p>
      <p>process.env:{JSON.stringify(process.env)}</p>

      <Map
        amapkey={process.env.REACT_APP_AMAP_API_KEY}
        version="1.4.15"
        center={defaultCenter}
        zoom={16}
      >
        <Marker position={{ latitude: 39.872334, longitude: 116.212816 }}>
          <img
            alt="map"
            src={photo}
            style={{ width: "50px", height: "50px" }}
          />
        </Marker>
      </Map>
    </div>
  );
}

export default AMap;
