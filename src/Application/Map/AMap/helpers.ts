/**
 * 返回某个文件夹（folderId）下的所有标记。
 *
 * `map` 来自 react-amap 的 Map 组件实例；window.AMap 目前是 any（见 src/globals.d.ts），
 * AMap 对象的类型先不做细化。
 */
export const getMarkersInFolder = (map: any, folderId: string) => {
  const markersInFolder: any[] = [];
  const markers = map.getAllOverlays("marker");
  markers.forEach((marker: any) => {
    if (marker.getExtData().folderId === folderId) {
      markersInFolder.push(marker);
    }
  });
  return markersInFolder;
};