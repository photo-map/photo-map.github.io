import React, { Component } from "react";
import ReactGA from "react-ga";

import Warning from "./Warning";
import Map from "./Map";

import "antd/dist/antd.css";
import "./index.css";

export default class Application extends Component {
  state = {
    gapiLoaded: false, // Google API loaded or not
    gapiClientLoading: false,
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
        gapiClientLoading: true,
      });
      window.gapi.load("client", () => {
        this.setState({
          gapiClientLoading: false,
        });
      });
    }
  }

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
