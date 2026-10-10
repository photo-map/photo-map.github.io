import type { PhotoFolder } from "../../types";
import type { BMapPoint } from "./types";

export const foldersToBMapPoints = (folders: PhotoFolder[]): BMapPoint[] => {
  const points: BMapPoint[] = [];
  folders.forEach((folder) => {
    folder.files.forEach((file) => {
      const location = file.imageMediaMetadata?.location;
      // 没有 GPS 的照片不参与取点，避免访问 undefined.location
      if (!location) return;
      points.push(
        {
          lat: location.latitude,
          lng: location.longitude,
        } as BMapPoint /*BMap.Point*/
      );
    });
  });
  return points;
};

// Fit Baidu map to multiple markers like Google Maps fitBounds
// https://stackoverflow.com/questions/28316976/fit-baidu-map-to-multiple-markers-like-google-maps-fitbounds
export const fitBMapMarkers = (
  map: BMapGL.Map | null,
  folders: PhotoFolder[]
) => {
  if (!map) {
    console.log("baidu map not loaded!");
    return;
  }
  if (folders.length === 0) {
    console.log("no folders found, will not fitBMapMarkers for baidu map");
    return;
  }
  const points = foldersToBMapPoints(folders);
  map.setViewport(points);
  console.log(`fit baidu map to ${points.length} markers`);
};

export const convert = (points: BMapPoint[]) => {
  return new Promise<{ status: number; points: BMapPoint[] }>((resolve, reject) => {
    const translateCallback = (response: {
      status: number;
      points: BMapPoint[];
    }) => {
      console.log("translateCallback", response);
      // status code definition: https://lbsyun.baidu.com/index.php?title=webapi/guide/changeposition
      if (response.status === 25) {
        // coords个数非法，超过限制
        console.log("more than limitation of this API");
        const ret = reject(new Error("more than limitation of this API"));
        console.log("translateCallback reject", ret);
        return ret;
      }
      if (response.status !== 0) {
        return reject(
          "unknown error, please check https://lbsyun.baidu.com/index.php?title=webapi/guide/changeposition for more details, response.status: " +
            response.status
        );
      }
      resolve(response);
    };
    const convertor = new window.BMapGL.Convertor();
    // https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html#a7b49
    // https://lbsyun.baidu.com/index.php?title=webapi/guide/changeposition
    convertor.translate(points, 1, 5, translateCallback); //真实经纬度转成百度坐标
  });
};
