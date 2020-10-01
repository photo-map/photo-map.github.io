import React, { Component } from "react";
import ReactGA from "react-ga";
import debugModule from "debug";

import Map from "./Map";

import "antd/dist/antd.css";
import "./index.css";

const debug = debugModule("photo-map:src/Application/index.jsx");

export default class Application extends Component {
  componentDidMount() {
    ReactGA.initialize("UA-48270916-5", {
      debug: true,
    });
  }

  render() {
    debug("render()");

    return (
      <div className="application">
        <Map />
      </div>
    );
  }
}
