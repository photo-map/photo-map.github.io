import PubSub from "pubsub-js";

import { getPhotos, getPhotosInFolder } from "../helpers/filesListHelpers";
import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from "../MenuDrawer/FolderList";
import { ADD_MARKERS_TOPIC, PRIVATE_FOLDER_ID } from "./AMap";

export const loadAndAddMarker = async () => {
  debugger;
  // Load photos in private folder of login user's Google Drive
  const files = await getPhotos();

  this.setState({
    files,
    message: "",
  });

  PubSub.publish(ADD_MARKERS_TOPIC, {
    files,
    visible:
      localStorage.getItem(localStorageKeyPrivateFolderVisible) === "true",
    folderId: PRIVATE_FOLDER_ID,
  });

  const foldersObj = JSON.parse(
    localStorage.getItem(localStorageKeyPublicFolders)
  );
  if (foldersObj) {
    Object.keys(foldersObj).forEach(async (folderId, b, c) => {
      // Get photos from public folder
      const resp = await getPhotosInFolder(folderId);
      PubSub.publish(ADD_MARKERS_TOPIC, {
        files: resp.files,
        visible: foldersObj[folderId],
        folderId,
      });
    });
  }
};
