import PubSub from "pubsub-js";

import { getFolderInfo, getPhotosInFolder } from "../helpers/filesListHelpers";
import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from "../MenuDrawer/FolderList";
import { ADD_MARKERS_TOPIC } from "./AMap";
import { PRIVATE_FOLDER_ID } from "../constants";

export const getPhotosInPublicFolder = async (folderId) => {
  const folderInfo = await getFolderInfo(folderId);
  // Get photos from public folder
  const resp = await getPhotosInFolder(folderId);
  if (resp.error) {
    console.error("Failed to get photos in a public folders, response:", resp);
    throw new Error(resp.error.message);
  }
  return {
    files: resp.files,
    visible: true,
    folderId,
    folderName: folderInfo.name,
  };
};

export const getPhotosInPublicFolders = async () => {
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

export const addMarkerToAMap = async (files) => {
  PubSub.publish(ADD_MARKERS_TOPIC, {
    files,
    visible:
      localStorage.getItem(localStorageKeyPrivateFolderVisible) === "true",
    folderId: PRIVATE_FOLDER_ID,
  });

  const folders = await getPhotosInPublicFolders();
  folders.forEach((folder) => PubSub.publish(ADD_MARKERS_TOPIC, folder));
};
