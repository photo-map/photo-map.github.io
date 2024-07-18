import PubSub from 'pubsub-js';

import { getFolderInfo, getPhotosInFolder } from '../helpers/filesListHelpers';
import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from '../MenuDrawer/FolderList';
import { ADD_MARKERS_TOPIC } from './AMap';
import { PRIVATE_FOLDER_ID } from '../constants';
import { foldersToBMapPoints, convert } from './BaiduMap/helpers';
import { chunk } from '../utils/utils';

/**
 * Some photos in one folder
 *
 * Sample of response
 *
 * ```json
 * {
 *   "files": [{
 *     "thumbnailLink": "https://lh3.googleusercontent.com/rSd...220",
 *     "imageMediaMetadata": {
 *       "location": {
 *         "latitude": 1,
 *         "longitude": 103,
 *         "altitude": 456
 *       }
 *     }
 *   }],
 *   "visible": true,
 *   "folderId": "",
 *   "folderName": ""
 * }
 * ```
 *
 * @typedef {Object} PhotoFolder
 * @property {string} folderId
 * @property {import("../utils/gDriveFilesApi").File[]} files
 * @property {boolean} [visible]
 * @property {string} [folderName]
 */

/**
 * @return {Promise<PhotoFolder>}
 */
export const getPhotosInPublicFolder = async (folderId) => {
  const folderInfo = await getFolderInfo(folderId);
  // Get photos from public folder
  const resp = await getPhotosInFolder(folderId);
  if (resp.error) {
    console.error('Failed to get photos in a public folders, response:', resp);
    throw new Error(resp.error.message);
  }
  return {
    files: resp.files,
    visible: true,
    folderId,
    folderName: folderInfo.name,
  };
};

/**
 * @return {Promise<PhotoFolder[]>}
 */
export const getPublicFoldersWithPhoto = async () => {
  const foldersObj = JSON.parse(
    localStorage.getItem(localStorageKeyPublicFolders)
  );
  if (!foldersObj) {
    return [];
  }
  return await Promise.all(
    Object.keys(foldersObj).map(async (folderId) => {
      return await getPhotosInPublicFolder(folderId);
    })
  );
};

// /** Provides information about files and allows JavaScript in a web page to access their content. */
// interface File extends Blob {
//   readonly lastModified: number;
//   readonly name: string;
// }

/**
 * Add photos in both private and public Google Drive folders to AMap
 * @param {import("../utils/gDriveFilesApi").File[]} files
 * @return {undefined}
 */
export const addMarkersToAMap = async (files) => {
  const privateFolder = {
    files,
    visible:
      localStorage.getItem(localStorageKeyPrivateFolderVisible) === 'true',
    folderId: PRIVATE_FOLDER_ID,
  };
  PubSub.publish(ADD_MARKERS_TOPIC, privateFolder);

  const publicFolders = await getPublicFoldersWithPhoto();
  publicFolders.forEach((folder) => PubSub.publish(ADD_MARKERS_TOPIC, folder));
};

export const getGpsBMapPointsMapping = async (folders) => {
  const gpsPoints = foldersToBMapPoints(folders);
  const chunkOfGpsPoints = chunk(gpsPoints, 10);

  const responses = await Promise.all(
    chunkOfGpsPoints.map(async (gpsPoints) => {
      const response = await convert(gpsPoints);
      return {
        gpsPoints,
        bMapPoints: response.points,
      };
    })
  );

  const gpsBMapPointsMapping = {};
  responses.forEach((item) => {
    item.gpsPoints.forEach((gpsPoint, index) => {
      const bMapPoint = item.bMapPoints[index];
      gpsBMapPointsMapping[`${gpsPoint.lat},${gpsPoint.lng}`] = bMapPoint;
    });
  });

  return gpsBMapPointsMapping;
};
