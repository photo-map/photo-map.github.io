import type { DriveFile, PhotoFolder } from "../../types";

export interface MarkerIconData {
  anchor: { x: number; y: number };
  labelOrigin: { x: number; y: number };
  // origin: {x:0,y:0},
  scaledSize: {
    // img size
    height: number;
    width: number;
  };
  // size: { // div size
  //   height: 100,
  //   width: 200,
  // },
  url: string | undefined;
}

export interface MarkerData {
  position: { lat: number; lng: number };
  icon: MarkerIconData;
}

/**
 * Fit Google Map to multiple markers, like Google Maps API fitBounds.
 *
 * `map` 来自调用方（google-map-react 的 onGoogleApiLoaded / 自己的 mapRef），
 * 其类型依赖 `@types/google.maps`，目前未安装，先按 any 处理（与 src/globals.d.ts 一致）。
 */
export const fitGoogleMapMarkers = (map: any, folders: PhotoFolder[]) => {
  if (folders.length === 0) {
    return;
  }

  // @type {google.maps.LatLngBounds} https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
  const bounds = new window.google.maps.LatLngBounds();

  folders.forEach((folder) => {
    if (folder.visible === false) return;
    folder.files.forEach((file) => {
      const location = file.imageMediaMetadata?.location;
      // extend(point), point is type of LatLng
      // 保持原 JS 行为（无 GPS 照片同样抛错），未像 BaiduMap/helpers 那样跳过，
      // 见 plan「阶段 2 行为差异」
      bounds.extend({
        lat: location!.latitude,
        lng: location!.longitude,
      });
    });
  });

  map.fitBounds(bounds);
};

export const file2Marker = (file: DriveFile): MarkerData => {
  const location = file.imageMediaMetadata?.location;
  const icon: MarkerIconData = {
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
  const data: MarkerData = {
    position: {
      lat: location!.latitude,
      lng: location!.longitude,
    } /* LatLngLiteral */,
    icon,
  };
  return data;
};