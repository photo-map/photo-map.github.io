import React, { Component } from "react";
import debugModule from "debug";

import Map from "./Map";
import "./index.css";

const debug = debugModule("photo-map:src/Application/index.jsx");

export default class Application extends Component {
  render() {
    debug("render()");

    return (
      <div className="application">
        <Map />
      </div>
    );
  }
}
