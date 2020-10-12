import React, { Component } from "react";
import ReactGA from "react-ga";

import HelpTip from "../components/HelpTip";

export default class Title extends Component {
  render() {
    return (
      <span>
        Photo Map{" "}
        <HelpTip>
          <div>
            Please read the{" "}
            <ReactGA.OutboundLink
              eventLabel="HowToUse"
              to="https://github.com/photo-map/photo-map.github.io/blob/master/help/HOW_TO_USE.md#how-to-use"
              target="_blank"
            >
              How to use
            </ReactGA.OutboundLink>{" "}
            document in GitHub repo.
          </div>
        </HelpTip>
      </span>
    );
  }
}
