// 180x180
import photo from "../assets/lair_white_worm_blb_librivox.jpeg";

import photo2 from "../assets/81l6BtKNnES._AC_UL160_SR160,160_.jpg";

const blueIcon =
  "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png";

/**
 * A photo icon, also check out {@link https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size|Size}
 * @type {Size}
 */
const iconSize = {
  // img size
  height: 50,
  width: 50,
};
// const iconSize = new google.maps.Size(50, 50)

/**
 * A photo icon, also check out {@link https://developers.google.com/maps/documentation/javascript/reference/marker#Icon|Icon}
 * @type {Icon}
 */
const photoIcon = {
  anchor: { x: 0, y: 0 },
  labelOrigin: { x: 0, y: 0 },
  // origin: {x:0,y:0},
  scaledSize: iconSize,
  // size: { // div size
  //   height: 100,
  //   width: 200,
  // },
  url: photo,
};
const photoIcon2 = {
  anchor: { x: 0, y: 0 },
  labelOrigin: { x: 0, y: 0 },
  // origin: {x:0,y:0},
  scaledSize: iconSize,
  // size: { // div size
  //   height: 100,
  //   width: 200,
  // },
  url: photo2,
};

/**
 * A photo marker, also check out {@link https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions|MarkerOptions}
 * @type {MarkerOptions}
 */
export const photoMarker = {
  position /* LatLngLiteral */: { lat: 39.872334, lng: 116.212816 },
  icon /* Icon */: photoIcon,
};
export const photoMarker2 = {
  position /* LatLngLiteral */: { lat: 39.870366, lng: 116.219547 },
  icon /* Icon */: photoIcon2,
};

export const simpleMarker = {
  position /* LatLngLiteral */: { lat: 39.871446, lng: 116.215768 },
  icon /* Icon */: {
    anchor: { x: 0, y: 0 },
    labelOrigin: { x: 0, y: 0 },
    // origin: {x:0,y:0},
    // scaledSize: ?,
    // size: ?,
    url: blueIcon,
  },
  label /* MarkerLabel */: {
    // color: '',
    // fontFamily: '',
    fontSize: "14px",
    fontWeight: "bold",
    text: "Foo",
  },
};
