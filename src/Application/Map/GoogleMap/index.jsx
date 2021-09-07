import React from "react";
import ReactGoogleMaps from "./ReactGoogleMaps";
import GoogleMapReact from "./GoogleMapReact";

export default class GoogleMap extends React.Component {
  // because react-google-maps is never maintained
  googleMapReactEnabled = true;
  render() {
    if (this.googleMapReactEnabled) {
      return (
        <GoogleMapReact
          defaultZoom={this.props.defaultZoom}
          defaultCenter={this.props.defaultCenter}
          markers={this.props.markers}
          folders={this.props.folders}
        />
      );
    }
    return (
      <ReactGoogleMaps
        defaultZoom={this.props.defaultZoom}
        defaultCenter={this.props.defaultCenter}
        markers={this.props.markers}
        folders={this.props.folders}
      />
    );
  }
}
