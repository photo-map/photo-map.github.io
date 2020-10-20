import PubSub from "pubsub-js";

import { getPhotosInFolder } from "../helpers/filesListHelpers";
import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from "../MenuDrawer/FolderList";
import { ADD_MARKERS_TOPIC, PRIVATE_FOLDER_ID } from "./AMap";

export const getPhotosInPublicFolder = async () => {
  const foldersObj = JSON.parse(
    localStorage.getItem(localStorageKeyPublicFolders)
  );
  if (!foldersObj) {
    return [];
  }
  return await Promise.all(
    Object.keys(foldersObj).map(async (folderId) => {
      // Get photos from public folder
      const resp = await getPhotosInFolder(folderId);
      console.log("xxxx", resp);
      return {
        files: resp.files,
        visible: foldersObj[folderId],
        folderId,
      };
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

  const folders = await getPhotosInPublicFolder();
  folders.forEach((folder) => PubSub.publish(ADD_MARKERS_TOPIC, folder));
};
