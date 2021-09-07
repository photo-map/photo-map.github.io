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
