import gapiRequest from "./gapiRequest";

/**
 * @export
 * @returns Promise<Files[]> Files type: https://developers.google.com/drive/api/v3/reference/files
 */
export default async function getPhotos(setMediaItems) {
  // https://developers.google.com/drive/api/v3/reference/files/list#request
  const resp = await gapiRequest({
    path: "https://www.googleapis.com/drive/v3/files",
    params: {
      // How to use "q" - https://developers.google.com/drive/api/v3/search-files
      q: "name = 'IMG_5031.JPG'",
      // 1. Get location - https://stackoverflow.com/a/54397863/4685522
      //    must prefix with "files/", for example "files/imageMediaMetadata"
      // 2. Get thumbnail - https://stackoverflow.com/a/45027853/4685522
      fields: "files/imageMediaMetadata/location,files/thumbnailLink",
    },
  });
  console.log("file list response:", resp);
  return resp.files;
}
