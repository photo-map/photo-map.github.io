export const getMarkersInFolder = (map, folderId) => {
  const markersInFolder = [];
  const markers = map.getAllOverlays("marker");
  markers.forEach((marker) => {
    if (marker.getExtData().folderId === folderId) {
      markersInFolder.push(marker);
    }
  });
  return markersInFolder;
};
