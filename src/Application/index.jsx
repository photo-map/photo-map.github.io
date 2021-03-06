import React, { Component } from "react";

import { initGa, initGapiClient, registerShortcut } from "./init";
import Warning from "./Warning";
import Map from "./Map";

// Styles for antd
import "antd/dist/antd.css";
// Styles for application
import "./index.css";

export default class Application extends Component {
  state = {
    gapiLoaded: false, // Google API loaded or not
    gapiClientLoading: false,
  };

  componentDidMount() {
    this.initApplication();
  }

  initApplication = () => {
    initGa();

    // window.gapiLoadedFlag is defined in public/index.html
    // This flag is true only when Google API's platform.js is loaded, .
    if (window.gapiLoadedFlag) {
      this.setState({
        gapiLoaded: true,
      });
      this.loadGapiClient();
    }

    registerShortcut();
  };

  loadGapiClient = () => {
    this.setState({
      gapiClientLoading: true,
    });
    initGapiClient().then(() => {
      this.setState({
        gapiClientLoading: false,
      });
    });
  };

  render() {
    if (!this.state.gapiLoaded) {
      return <Warning />;
    }

    if (this.state.gapiClientLoading) {
      return <div>gapi client lib is loading</div>;
    }

    return (
      <div className="application">
        <Map />
      </div>
    );
  }
}
