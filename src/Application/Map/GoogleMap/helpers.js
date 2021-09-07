export const fitGoogleMapMarkers = (map, folders) => {
  if (folders.length === 0) {
    return;
  }

  // @type {google.maps.LatLngBounds} https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
  const bounds = new window.google.maps.LatLngBounds();

  folders.forEach((folder) => {
    if (folder.visible === false) return;
    folder.files.forEach((file) => {
      // extend(point), point is type of LatLng
      bounds.extend({
        lat: file.imageMediaMetadata.location.latitude,
        lng: file.imageMediaMetadata.location.longitude,
      });
    });
  });

  map.fitBounds(bounds);
};

export const file2Marker = (file) => {
  const icon = {
    anchor: { x: 0, y: 0 },
    labelOrigin: { x: 0, y: 0 },
    // origin: {x:0,y:0},
    scaledSize: {
      // img size
      height: 64,
      width: 64,
    },
    // size: { // div size
    //   height: 100,
    //   width: 200,
    // },
    url: file.thumbnailLink,
  }; /* Icon */
  const data = {
    position: {
      lat: file.imageMediaMetadata.location.latitude,
      lng: file.imageMediaMetadata.location.longitude,
    } /* LatLngLiteral */,
    icon,
  };
  return data;
};
