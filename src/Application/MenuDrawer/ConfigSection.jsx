import React, { Component } from "react";
import { Button } from "antd";

import { exportConfig, importConfig } from "./helpers";

export default class ConfigSection extends Component {
  constructor(props) {
    super(props);
    this.downloadRef = React.createRef();
    this.inputRef = React.createRef();
    this.state = {
      href: "{}",
    };
  }

  handleDownload = () => {
    this.setState({ href: exportConfig(localStorage) }, () => {
      if (this.downloadRef && this.downloadRef.current) {
        this.downloadRef.current.click();
      } else {
        alert("downloadRef or node is undefined!");
      }
    });
  };

  handleImport = () => {
    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.click();
    } else {
      alert("inputRef or node is undefined!");
    }
  };

  // Solution A: https://stackoverflow.com/a/27116209/4685522
  // Solution B: https://stackoverflow.com/a/48176648/4685522
  handleChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = await new Response(file).text();
      var obj = JSON.parse(data);
      importConfig(localStorage, obj);
    }
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
        <Button onClick={this.handleDownload}>Export</Button>
        <input
          ref={this.inputRef}
          className="import-config-file-helper"
          type="file"
          style={{ display: "none" }}
          onChange={this.handleChange}
        />
        <Button onClick={this.handleImport}>Import</Button>
      </div>
    );
  }
}
