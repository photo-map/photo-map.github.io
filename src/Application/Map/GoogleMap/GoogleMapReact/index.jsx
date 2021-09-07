import React from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default class GoogleMapReactWrapper extends React.Component {
  handleApiLoaded = ({ map, maps }) => {
    console.log(map, maps);
  };

  render() {
    // https://github.com/google-map-react/google-map-react
    return (
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
          defaultCenter={this.props.defaultCenter}
          defaultZoom={this.props.defaultZoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={this.handleApiLoaded}
        >
          <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact>
      </div>
    );
  }
}
