import PubSub from 'pubsub-js';

import { getFolderInfo, getPhotosInFolder } from '../helpers/filesListHelpers';
import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from '../MenuDrawer/FolderList';
import { ADD_MARKERS_TOPIC } from './AMap';
import { PRIVATE_FOLDER_ID } from '../constants';
import type { DriveFile, PhotoFolder } from '../types';

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
 * 类型统一指向 `../types` 的 `PhotoFolder`（plan 约定：不再维护 JSDoc @typedef）。
 */

export const getPhotosInPublicFolder = async (
  folderId: string
): Promise<PhotoFolder> => {
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

export const getPublicFoldersWithPhoto = async (): Promise<PhotoFolder[]> => {
  // 原 JS：JSON.parse(localStorage.getItem(...))，key 不存在时 getItem 返回 null、
  // JSON.parse(null) 解析为 null（与 MenuDrawer/FolderList 的 decode 同处理）
  const foldersObj = JSON.parse(
    localStorage.getItem(localStorageKeyPublicFolders) ?? 'null'
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
 */
export const addMarkersToAMap = async (files: DriveFile[]) => {
  const privateFolder: PhotoFolder = {
    files,
    visible:
      localStorage.getItem(localStorageKeyPrivateFolderVisible) === 'true',
    folderId: PRIVATE_FOLDER_ID,
  };
  PubSub.publish(ADD_MARKERS_TOPIC, privateFolder);

  const publicFolders = await getPublicFoldersWithPhoto();
  publicFolders.forEach((folder) => PubSub.publish(ADD_MARKERS_TOPIC, folder));
};