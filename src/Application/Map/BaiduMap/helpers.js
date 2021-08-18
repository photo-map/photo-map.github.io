export const foldersToBMapPoints = (folders) => {
  const points = [];
  folders.forEach((folder) => {
    folder.files.forEach((file) => {
      points.push(
        {
          lat: file.imageMediaMetadata.location.latitude,
          lng: file.imageMediaMetadata.location.longitude,
        } /*BMap.Point*/
      );
    });
  });
  return points;
};

// Fit Baidu map to multiple markers like Google Maps fitBounds
// https://stackoverflow.com/questions/28316976/fit-baidu-map-to-multiple-markers-like-google-maps-fitbounds
export const fitBMapMarkers = (map, folders) => {
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

export const convert = (points) => {
  return new Promise(function (resolve, reject) {
    const translateCallback = (response) => {
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
