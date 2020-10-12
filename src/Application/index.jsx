import React, { Component } from "react";
import ReactGA from "react-ga";

import Warning from "./Warning";
import Map from "./Map";

import "antd/dist/antd.css";
import "./index.css";

export default class Application extends Component {
  state = {
    gapiLoaded: false, // Google API loaded or not
  };

  componentDidMount() {
    ReactGA.initialize("UA-48270916-5", {
      debug: true,
    });

    // window.gapiLoadedFlag is defined in public/index.html
    // This flag is true only when Google API's platform.js is loaded, .
    if (window.gapiLoadedFlag) {
      this.setState({
        gapiLoaded: true,
      });
    }
  }

  render() {
    if (!this.state.gapiLoaded) {
      return <Warning />;
    }

    return (
      <div className="application">
        <Map />
      </div>
    );
  }
}
