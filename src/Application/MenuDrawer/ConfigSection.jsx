import React, { Component } from "react";
import { Button } from "antd";

import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from "./FolderList";
import { localStorageKeySelectedMap } from "../Map";

export default class ConfigSection extends Component {
  constructor(props) {
    super(props);
    this.downloadRef = React.createRef();
    this.state = {
      href: "{}",
    };
  }

  handleDownload = () => {
    const storageObj = {
      [localStorageKeyPrivateFolderVisible]: localStorage.getItem(
        localStorageKeyPrivateFolderVisible
      ),
      [localStorageKeyPublicFolders]: localStorage.getItem(
        localStorageKeyPublicFolders
      ),
      [localStorageKeySelectedMap]: localStorage.getItem(
        localStorageKeySelectedMap
      ),
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(storageObj, null, 2));
    this.setState({ href: dataStr }, () => {
      if (this.downloadRef && this.downloadRef.current) {
        this.downloadRef.current.click();
      } else {
        alert("downloadRef or node is undefined!");
      }
    });
  };

  render() {
    return (
      <div>
        <h3>Download application config</h3>
        <a
          ref={this.downloadRef}
          href={this.state.href}
          style={{ display: "none" }}
          download="photo-map-config.json"
        >
          Download Config File
        </a>
        <Button onClick={this.handleDownload}>Download</Button>
      </div>
    );
  }
}
