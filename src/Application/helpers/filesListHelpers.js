import { filesList } from "../utils/gDriveFilesApi";

const filesFields = [
  "files/imageMediaMetadata/location",
  "files/thumbnailLink",
  "files/webContentLink", // original photo link, can used in <img> tag
  "files/webViewLink", // Google Drive link to preview this photo.
].join(",");

export const getFilesInFolder = async (folderId) =>
  await filesList({
    q: `'${folderId}' in parents`, // get files in this folder
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
  const resp = await getFilesInFolder(folderId);
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
