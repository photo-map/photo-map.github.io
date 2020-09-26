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
      <Map
        amapkey={process.env.REACT_APP_AMAP_API_KEY}
        version="1.4.15"
        center={defaultCenter}
        zoom={16}
      >
        {props.files.map((file) => (
          <Marker
            key={JSON.stringify(file)}
            position={{
              latitude: file.imageMediaMetadata.location.latitude,
              longitude: file.imageMediaMetadata.location.longitude,
            }}
            __position={{ latitude: 39.872334, longitude: 116.212816 }}
          >
            <img
              alt="map"
              src={file.thumbnailLink}
              __src={photo}
              style={{ width: "50px", height: "50px" }}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
}

export default AMap;
