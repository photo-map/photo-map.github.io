import { filesGet, filesList } from "../utils/gDriveFilesApi";

const filesFields = [
  "files/imageMediaMetadata/location",
  "files/thumbnailLink",
  "files/webContentLink", // original photo link, can used in <img> tag
  "files/webViewLink", // Google Drive link to preview this photo.
].join(",");

// Sample response:
// {
//   id: "1nem5ZFB1xj3NuLT3aknYs7z4KTk6Cya6"
//   kind: "drive#file"
//   mimeType: "application/vnd.google-apps.folder"
//   name: "2020-05-21 莲石湖公园"
// }
export const getFolderInfo = async (folderId) =>
  await filesGet({
    fileId: folderId,
  });

/**
 * Get all photos in a folder
 * @todo Filter out the response, leave only the photos with GPS locations,
 *       maybe popup some warning about photos without GPS locations.
 */
export const getPhotosInFolder = async (folderId) =>
  await filesList({
    q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png')`, // get files in this folder
    // fields: "files/*", // debug
    fields: filesFields, // location and photo link
  });

/**
 * resp = {
 *   files: [{
 *     "kind": "drive#file",
 *     "id": "1Kv...MF",
 *     "name": "Photo Map",
 *     "mimeType": "application/vnd.google-apps.folder"
 *   }]
 * }
 */
const getPhotoMapFolder = async () =>
  await filesList({
    // Find resource name is "Photo Map", type is folder
    q: "name='Photo Map' and mimeType='application/vnd.google-apps.folder'",
  });

/**
 * @export
 * @returns Promise<Files[]> Files type: https://developers.google.com/drive/api/v3/reference/files
 */
export const getPhotos = async (setMediaItems) => {
  const foldersResp = await getPhotoMapFolder();
  const folderId = foldersResp.files[0].id;
  const resp = await getPhotosInFolder(folderId);
  // resp: {
  //   "files": [
  //     {
  //       "thumbnailLink": "https://lh3.googleusercontent.com/rSd...220",
  //       "imageMediaMetadata": {
  //         "location": {
  //           "latitude": 1,
  //           "longitude": 103,
  //           "altitude": 456
  //         }
  //       }
  //     }
  //   ]
  // }
  return resp.files;
};
