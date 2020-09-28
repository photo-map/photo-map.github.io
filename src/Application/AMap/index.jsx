import React, { Component } from "react";
import { Map, Marker } from "react-amap";
import debugModule from "debug";

import "./index.css";

const debug = debugModule("photo-map:src/Application/AMap/index.jsx");

export default class AMap extends Component {
  render() {
    debug("render()", this.props);
    const { defaultCenter, photos } = this.props;

    return (
      <div className="amap-wrapper">
        <Map
          amapkey={process.env.REACT_APP_AMAP_API_KEY}
          version="1.4.15"
          center={defaultCenter}
          zoom={16}
          onInstanceCreated={this.props.onMapInstanceCreated}
        >
          {photos.map((photo) => {
            return (
              <Marker
                key={JSON.stringify(photo)}
                position={photo.position}
                __position={{ latitude: 39.872334, longitude: 116.212816 }}
              >
                <img
                  alt="map"
                  src={photo.thumbnail}
                  __src={photo}
                  style={{ width: "50px", height: "50px" }}
                />
              </Marker>
            );
          })}
        </Map>
      </div>
    );
  }
}
